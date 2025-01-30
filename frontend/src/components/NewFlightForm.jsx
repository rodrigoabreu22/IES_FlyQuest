import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import FlightConsumer from "../api_consumer/FlightConsumer";
import StaffConsumer from "../api_consumer/StaffConsumer";
import PlaneConsumer from "../api_consumer/PlaneConsumer";
import CityWeatherConsumer from "../api_consumer/CityWeatherConsumer";

const NewFlightForm = () => {
    const [pilots, setPilots] = useState([]);
    const [attendants, setAttendants] = useState([]);
    const [planes, setPlanes] = useState([]);
    const [formData, setFormData] = useState({
        departureCity: "",
        arrivalCity: "",
        departureCountry: "",
        arrivalCountry: "",
        departureDateTime: "",
        arrivalDateTime: "",
        plane: "",
        pilot: "",
        copilot: "",
        flightAttendant1: "",
        flightAttendant2: "",
        flightAttendant3: "",
        flightAttendant4: "",
    });
    const [formKey, setFormKey] = useState(0); 
    const [isReadyForStaffFetch, setIsReadyForStaffFetch] = useState(false);
    const [cities, setCities] = useState([]);

    const getCurrentDateTime = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16); 
    };

    useEffect(() => {
        const getAllCities = async () => {
            try {
                const cities = await CityWeatherConsumer.fetchAllCities();
                setCities(cities);
            }
            catch (error) {
                console.error("Error fetching cities:", error);
            }
        };

        if (isReadyForStaffFetch) {
            const fetchStaffAndPlanes = async () => {
                try {
                    const pilotResponse = await StaffConsumer.fetchEmployees("Pilot");
                    const attendantResponse = await StaffConsumer.fetchEmployees("Flight Attendant");
                    const planeResponse = await PlaneConsumer.fetchPlanes();
                    setPilots(pilotResponse);
                    setAttendants(attendantResponse);
                    setPlanes(planeResponse);

                    if (pilots.length > 0) {
                        calcAvailablePilots();
                    }

                    if (attendants.length > 0) {
                        calcAvailableAttendants();
                    }

                    if (planes.length > 0) {
                        calcAvailablePlanes();
                    }
                } 
                catch (error) {
                    console.error("Error fetching staff:", error);
                }
            };

            fetchStaffAndPlanes();
        }

        getAllCities();
    }, [isReadyForStaffFetch, formData.departureDateTime, formData.arrivalDateTime]);

    const calcAvailablePilots = async () => {
        const { departureDateTime, arrivalDateTime } = formData;
    
        try {
            const availablePilots = await Promise.all(
                pilots.map(async (pilot) => {
                    const pilotFlights = await StaffConsumer.fetchEmployeeFlights(pilot.id);
    
                    const isAvailable = pilotFlights.every((flight) => {
                        const departure_date = flight.departureDate;
                        const arrival_date = flight.arrivalDate;
                        const status = flight.status;

                        if (status === "CANCELED") {
                            return true;
                        }
                        
                        const isBefore = new Date(arrivalDateTime) <= new Date(departure_date); 
                        const isAfter = new Date(departureDateTime) >= new Date(arrival_date); 
    
                        return isBefore || isAfter;
                    });
    
                    return isAvailable ? pilot : null;
                })
            );
    
            setPilots(availablePilots.filter((pilot) => pilot !== null));
        } 
        catch (error) {
            console.error("Error calculating available pilots:", error);
        }
    };

    const calcAvailableAttendants = async () => {
        const { departureDateTime, arrivalDateTime } = formData;

        try {
            const availableAttendants = await Promise.all(
                attendants.map(async (attendant) => {
                    const attendantFlights = await StaffConsumer.fetchEmployeeFlights(attendant.id);

                    const isAvailable = attendantFlights.every((flight) => {
                        const departure_date = flight.departureDate;
                        const arrival_date = flight.arrivalDate;
                        const status = flight.status;

                        if (status === "CANCELED") {
                            return true;
                        }

                        const isBefore = new Date(arrivalDateTime) <= new Date(departure_date);
                        const isAfter = new Date(departureDateTime) >= new Date(arrival_date);

                        return isBefore || isAfter;
                    });

                    return isAvailable ? attendant : null;
                })
            );

            setAttendants(availableAttendants.filter((attendant) => attendant !== null));
        }
        catch (error) {
            console.error("Error calculating available attendants:", error);
        }
    };

    const calcAvailablePlanes = async () => {
        const { departureDateTime, arrivalDateTime } = formData;

        try {
            const availablePlanes = await Promise.all(
                planes.map(async (plane) => {
                    const planeFlights = await PlaneConsumer.fetchPlaneFlights(plane.id);

                    const isAvailable = planeFlights.every((flight) => {
                        const departure_date = flight.departureDate;
                        const arrival_date = flight.arrivalDate;

                        const isBefore = new Date(arrivalDateTime) <= new Date(departure_date);
                        const isAfter = new Date(departureDateTime) >= new Date(arrival_date);

                        return isBefore || isAfter;
                    });
                
                    return isAvailable ? plane : null;
                })
            );

            setPlanes(availablePlanes.filter((plane) => plane !== null));
        }
        catch (error) {
            console.error("Error calculating available planes:", error);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "departureDateTime" || name === "arrivalDateTime") {
            const { departureDateTime, arrivalDateTime } = {
                ...formData,
                [name]: value,
            };

            const isDepartureValid = departureDateTime >= getCurrentDateTime();
            const isArrivalValid =
                arrivalDateTime > departureDateTime &&
                arrivalDateTime >= getCurrentDateTime();

            if (isDepartureValid && isArrivalValid) {
                setIsReadyForStaffFetch(true);
            } else {
                setIsReadyForStaffFetch(false);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.departureCity === formData.arrivalCity) {
            alert("Departure city and arrival city must be different!");
            return;
        }

        const crewMembers = [
            formData.pilot,
            formData.copilot,
            formData.flightAttendant1,
            formData.flightAttendant2,
            formData.flightAttendant3,
            formData.flightAttendant4,
        ];
    
        const uniqueCrewMembers = new Set(crewMembers.filter((member) => member)); // Remove empty values and check for uniqueness
    
        if (uniqueCrewMembers.size !== crewMembers.filter((member) => member).length) {
            alert("Duplicate employees selected! Please ensure all crew members are unique.");
            return;
        }
        
        const flight = {
            "departureCity": formData.departureCity,
            "arrivalCity": formData.arrivalCity,
            "departureCountry": formData.departureCountry,
            "arrivalCountry": formData.arrivalCountry,
            "departureDate": formData.departureDateTime,
            "arrivalDate": formData.arrivalDateTime,
            "plane": formData.plane,
            "occupationBusiness" : 0,
            "occupationEconomic" : 0,
            "crew": {
                "pilot": formData.pilot,
                "copilot": formData.copilot,
                "attendant1": formData.flightAttendant1,
                "attendant2": formData.flightAttendant2,
                "attendant3": formData.flightAttendant3,
                "attendant4": formData.flightAttendant4,
            },
        };

        FlightConsumer.addFlight(flight);
        console.log("Form Submitted!");

        // Clear form data
        setFormData({
            departureCity: "",
            arrivalCity: "",
            departureCountry: "",
            arrivalCountry: "",
            departureDateTime: "",
            arrivalDateTime: "",
            plane: "",
            pilot: "",
            copilot: "",
            flightAttendant1: "",
            flightAttendant2: "",
            flightAttendant3: "",
            flightAttendant4: "",
        });

        setAttendants([]);
        setPilots([]);
        setPlanes([]);
        setIsReadyForStaffFetch(false);

        setFormKey((prevKey) => prevKey + 1);
    };

    const handleCancel = () => {
        setFormData({
            departureCity: "",
            arrivalCity: "",
            departureCountry: "",
            arrivalCountry: "",
            departureDateTime: "",
            arrivalDateTime: "",
            plane: "",
            pilot: "",
            copilot: "",
            flightAttendant1: "",
            flightAttendant2: "",
            flightAttendant3: "",
            flightAttendant4: "",
        });

        setAttendants([]);
        setPilots([]);
        setPlanes([]);
        setIsReadyForStaffFetch(false);

        setFormKey((prevKey) => prevKey + 1);
    };

    return (
        <Container className="mt-5">
            <div
                className="p-4 rounded container"
                style={{
                    backgroundColor: "white",
                    border: "2px solid green",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
            >
                <h3 className="mb-4 text-center">New Flight</h3>
                <Form key={formKey} onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="departureCity">
                                <Form.Label>Departure City:</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="departureCity"
                                    value={formData.departureCity}
                                    onChange={handleInputChange}
                                    placeholder="Select departure city"
                                >
                                    <option value="">Select a Departure City</option>
                                    {cities.map((city) => (
                                        <option key={city.id} value={city.cityName}>
                                            {city.cityName}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="departureCountry">
                                <Form.Label>Departure Country:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="departureCountry"
                                    value={formData.departureCountry}
                                    onChange={handleInputChange}
                                    placeholder="Enter departure country"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="arrivalCity">
                                <Form.Label>Arrival City:</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="arrivalCity"
                                    value={formData.arrivalCity}
                                    onChange={handleInputChange}
                                    placeholder="Select arrival city"
                                >
                                    <option value="">Select an Arrival City</option>
                                    {cities.map((city) => (
                                        <option key={city.id} value={city.cityName}>
                                            {city.cityName}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="arrivalCountry">
                                <Form.Label>Arrival Country:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="arrivalCountry"
                                    value={formData.arrivalCountry}
                                    onChange={handleInputChange}
                                    placeholder="Enter arrival country"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="departureDateTime">
                                <Form.Label>Departure Date and Time:</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="departureDateTime"
                                    value={formData.departureDateTime}
                                    onChange={handleInputChange}
                                    min={getCurrentDateTime()} 
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="arrivalDateTime">
                                <Form.Label>Arrival Date and Time:</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="arrivalDateTime"
                                    value={formData.arrivalDateTime}
                                    onChange={handleInputChange}
                                    min={formData.departureDateTime || getCurrentDateTime()} 
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="plane">
                                <Form.Label>Plane:</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="plane"
                                    value={formData.plane}
                                    onChange={handleInputChange}
                                    disabled={!isReadyForStaffFetch} 
                                >
                                    <option value="">Select a Plane</option>
                                    {planes.map((plane) => (
                                        <option key={plane.id} value={plane.id}>
                                            {plane.id} - totalSeats: {plane.businessSeats + plane.economicSeats}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="pilot">
                                <Form.Label>Pilot:</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="pilot"
                                    value={formData.pilot}
                                    onChange={handleInputChange}
                                    disabled={!isReadyForStaffFetch}
                                >
                                    <option value="">Select a Pilot</option>
                                    {pilots.map((pilot) => (
                                        <option key={pilot.id} value={pilot.id}>
                                            {pilot.firstName} {pilot.lastName}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="copilot">
                                <Form.Label>Co-Pilot:</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="copilot"
                                    value={formData.copilot}
                                    onChange={handleInputChange}
                                    disabled={!isReadyForStaffFetch}
                                >
                                    <option value="">Select a Co-Pilot</option>
                                    {pilots.map((pilot) => (
                                        <option key={pilot.id} value={pilot.id}>
                                            {pilot.firstName} {pilot.lastName}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        {[1, 2, 3, 4].map((num) => (
                            <Col md={3} key={num}>
                                <Form.Group controlId={`flightAttendant${num}`}>
                                    <Form.Label>Flight Attendant {num}:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name={`flightAttendant${num}`}
                                        value={formData[`flightAttendant${num}`]}
                                        onChange={handleInputChange}
                                        disabled={!isReadyForStaffFetch}
                                    >
                                        <option value="">Select an Attendant</option>
                                        {attendants.map((attendant) => (
                                            <option key={attendant.id} value={attendant.id}>
                                                {attendant.firstName} {attendant.lastName}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        ))}
                    </Row>
                    <div className="d-flex justify-content-end">
                        <Button type="submit" variant="success" className="me-2">
                            SUBMIT
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleCancel}>
                            CLEAN
                        </Button>
                    </div>
                </Form>
            </div>
        </Container>
    );
};

export default NewFlightForm;
