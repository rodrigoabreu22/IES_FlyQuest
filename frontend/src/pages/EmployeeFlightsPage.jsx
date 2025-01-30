import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Offcanvas, Modal } from "react-bootstrap";
import FlightCard from "../components/FlightCard";
import Navbar from "../components/Navbar";
import StaffConsumer from "../api_consumer/StaffConsumer";
import PlaneConsumer from "../api_consumer/PlaneConsumer";
import Footer from '../components/Footer';
import FlightCrew from '../components/FlightCrew';
import FlightCrewPilot from '../components/FlightCrewPilot';
import "../css/Layout.css";



function EmployeeFlightsPage() {
    const today = new Date().toISOString().split("T")[0]; 
    const user = JSON.parse(localStorage.getItem("user"));
    const id = user.id; 

    const [flights, setFlights] = useState([]);
    const [filteredFlights, setFilteredFlights] = useState([]);
    const [planes, setPlanes] = useState([]);
    const [filters, setFilters] = useState({
        day: today, 
        departureCity: "",
        arrivalCity: "",
        flightState: "All",
        planeId: "", 
        search: "",
    });
    const [order, setOrder] = useState({ field: "", ascending: true });
    const [showFilters, setShowFilters] = useState(false); 
    const [showModal, setShowModal] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState(null);
    
    useEffect(() => {
        const fetchFlights = async () => {
            const response = await StaffConsumer.fetchEmployeeFlights(id);
            setFlights(response);
            setFilteredFlights(response.filter((flight) => isFlightOnDay(flight, today)));
        };

        const fetchPlanes = async () => {
            const response = await PlaneConsumer.fetchPlanes(); 
            setPlanes(response); 
        };

        fetchFlights();
        fetchPlanes();
    }, []);

    useEffect(() => {
        filterAndSortFlights();
    }, [filters, order, flights]);

    const isFlightOnDay = (flight, day) => {
        const departureDate = flight.departureDate.split("T")[0];
        const arrivalDate = flight.arrivalDate.split("T")[0];
        return departureDate === day || arrivalDate === day;
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const clearFilters = () => {
        setFilters({
            ...filters,
            day: "",
            departureCity: "",
            arrivalCity: "",
            flightState: "All",
            planeId: "", 
        });
        setFilteredFlights(flights);
    };

    const handleOrderChange = (e) => {
        const value = e.target.value;
        if (value === "") {
            setOrder({ field: "", ascending: true });
        } else {
            const [field, direction] = value.split("_");
            setOrder({ field, ascending: direction === "asc" });
        }
    };

    const handleFlightClick = (flightId) => {
        console.log("Flight clicked:", flightId);
        const flight = flights.find((f) => f.id === flightId);
        if (flight) {
            console.log("Selected flight:", flight);
            setSelectedFlight(flight); 
            setShowModal(true); 
        }
    };
    
    
    

    const clearOrderFilters = () => {
        setOrder({ field: "", ascending: true });
    };

    const filterAndSortFlights = () => {
        let updatedFlights = flights;

        if (filters.search) {
            updatedFlights = flights.filter((flight) =>
                String(flight.id).toLowerCase().includes(filters.search.toLowerCase())
            );
        } else {
            if (filters.day) {
                updatedFlights = updatedFlights.filter((flight) =>
                    isFlightOnDay(flight, filters.day)
                );
            }
            if (filters.departureCity) {
                updatedFlights = updatedFlights.filter((flight) =>
                    flight.departureCity.toLowerCase().includes(filters.departureCity.toLowerCase())
                );
            }
            if (filters.arrivalCity) {
                updatedFlights = updatedFlights.filter((flight) =>
                    flight.arrivalCity.toLowerCase().includes(filters.arrivalCity.toLowerCase())
                );
            }
            if (filters.flightState !== "All") {
                updatedFlights = updatedFlights.filter((flight) => flight.status === filters.flightState);
            }
            if (filters.planeId) {
                const planeIdLong = parseInt(filters.planeId, 10);
                updatedFlights = updatedFlights.filter((flight) => flight.plane === planeIdLong);
            }
        }

        // Sorting logic
        if (order.field) {
            updatedFlights = [...updatedFlights].sort((a, b) => {
                if (a[order.field] < b[order.field]) return order.ascending ? -1 : 1;
                if (a[order.field] > b[order.field]) return order.ascending ? 1 : -1;
                return 0;
            });
        }

        setFilteredFlights(updatedFlights);
    };

    return (
        <div id="root">
            <Navbar />
            <div className="content">
            <Container style={{paddingTop: "30px" }}>
                <Row>
                    <Col sm={12} className="d-md-none mb-3">
                        <Button variant="secondary" onClick={() => setShowFilters(true)} style={{ width: "100%" }}>
                            Open Filters
                        </Button>
                    </Col>

                    <Col sm={3} className="d-none d-md-block">
                        <h4>Filters</h4>
                        <Form>
                            <Form.Group controlId="filterDay">
                                <Form.Label>Day</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="day"
                                    value={filters.day}
                                    onChange={handleFilterChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="filterDepartureCity" className="mt-3">
                                <Form.Label>Departure City</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter city"
                                    name="departureCity"
                                    value={filters.departureCity}
                                    onChange={handleFilterChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="filterArrivalCity" className="mt-3">
                                <Form.Label>Arrival City</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter city"
                                    name="arrivalCity"
                                    value={filters.arrivalCity}
                                    onChange={handleFilterChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="filterFlightState" className="mt-3">
                                <Form.Label>Flight State</Form.Label>
                                <Form.Select
                                    name="flightState"
                                    value={filters.flightState}
                                    onChange={handleFilterChange}
                                >
                                    <option>All</option>
                                    <option>SCHEDULED</option>
                                    <option>CANCELED</option>
                                    <option>COMPLETED</option>
                                    <option>IN PROGRESS</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group controlId="filterPlaneId" className="mt-3">
                                <Form.Label>Plane</Form.Label>
                                <Form.Select
                                    name="planeId"
                                    value={filters.planeId}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All</option>
                                    {planes.map((plane) => (
                                        <option key={plane.id} value={plane.id}>
                                            {plane.id}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Button
                                variant="secondary"
                                onClick={clearFilters}
                                className="mt-3"
                                style={{ width: "100%" }}
                            >
                                Clear Filters
                            </Button>

                            {/* Order Filters */}
                            <h4 className="mt-4">Order</h4>
                            <Form.Group controlId="orderFilters">
                                <Form.Label>Order By</Form.Label>
                                <Form.Select
                                    onChange={handleOrderChange}
                                    value={order.field ? `${order.field}_${order.ascending ? "asc" : "desc"}` : ""}
                                >
                                    <option value="">None</option>
                                    <option value="departureDate_asc">Departure Date (Ascending)</option>
                                    <option value="departureDate_desc">Departure Date (Descending)</option>
                                    <option value="arrivalDate_asc">Arrival Date (Ascending)</option>
                                    <option value="arrivalDate_desc">Arrival Date (Descending)</option>
                                </Form.Select>
                            </Form.Group>
                            <Button
                                variant="secondary"
                                onClick={clearOrderFilters}
                                className="mt-3"
                                style={{ width: "100%" }}
                            >
                                Clear Ordering
                            </Button>
                        </Form>
                    </Col>

                    {/* Filters Offcanvas for Small Screens */}
                    <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="start">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Filters</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Form>
                                <Form.Group controlId="filterDay">
                                    <Form.Label>Day</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="day"
                                        value={filters.day}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="filterDepartureCity" className="mt-3">
                                    <Form.Label>Departure City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter city"
                                        name="departureCity"
                                        value={filters.departureCity}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="filterArrivalCity" className="mt-3">
                                    <Form.Label>Arrival City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter city"
                                        name="arrivalCity"
                                        value={filters.arrivalCity}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="filterFlightState" className="mt-3">
                                    <Form.Label>Flight State</Form.Label>
                                    <Form.Select
                                        name="flightState"
                                        value={filters.flightState}
                                        onChange={handleFilterChange}
                                    >
                                        <option>All</option>
                                        <option>SCHEDULED</option>
                                        <option>CANCELED</option>
                                        <option>COMPLETED</option>
                                        <option>IN PROGRESS</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group controlId="filterPlaneId" className="mt-3">
                                    <Form.Label>Plane</Form.Label>
                                    <Form.Select
                                        name="planeId"
                                        value={filters.planeId}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">All</option>
                                        {planes.map((plane) => (
                                            <option key={plane.id} value={plane.id}>
                                                {plane.id}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Button
                                    variant="secondary"
                                    onClick={clearFilters}
                                    className="mt-3"
                                    style={{ width: "100%" }}
                                >
                                    Clear Filters
                                </Button>

                                {/* Order Filters */}
                                <h4 className="mt-4">Order</h4>
                                <Form.Group controlId="orderFilters">
                                    <Form.Label>Order By</Form.Label>
                                    <Form.Select
                                        onChange={handleOrderChange}
                                        value={order.field ? `${order.field}_${order.ascending ? "asc" : "desc"}` : ""}
                                    >
                                        <option value="">None</option>
                                        <option value="departureDate_asc">Departure Date (Ascending)</option>
                                        <option value="departureDate_desc">Departure Date (Descending)</option>
                                        <option value="arrivalDate_asc">Arrival Date (Ascending)</option>
                                        <option value="arrivalDate_desc">Arrival Date (Descending)</option>
                                    </Form.Select>
                                </Form.Group>
                                <Button
                                    variant="secondary"
                                    onClick={clearOrderFilters}
                                    className="mt-3"
                                    style={{ width: "100%" }}
                                >
                                    Clear Ordering
                                </Button>

                            </Form>
                        </Offcanvas.Body>
                    </Offcanvas>

                    {/* Flights List */}
                    <Col sm={9}>
                        <Row className="mb-3 align-items-center">
                            <Col>
                                <Form.Control
                                    style={{ zIndex: 10, position: "relative" }}
                                    type="text"
                                    placeholder="Search by Flight ID"
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                />
                            </Col>
                        </Row>
                        {filteredFlights.map((flight) => (
                            <FlightCard
                                onClick={handleFlightClick} // Passe a função de clique
                                key={flight.id}
                                id={flight.id}
                                departure_country={flight.departureCountry}
                                arrival_country={flight.arrivalCountry}
                                departureCity={flight.departureCity}
                                arrivalCity={flight.arrivalCity}
                                departure_date={flight.departureDate}
                                arrival_date={flight.arrivalDate}
                                occupation_business={flight.occupationBusiness}
                                occupation_economic={flight.occupationEconomic}
                                airplane={flight.plane}
                                status={flight.status}
                            />
                        ))}
                    </Col>
                </Row>
            </Container>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Flight Crew Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {console.log("User role:", user.role)}
                {console.log("Selected flight:", selectedFlight)}
                {console.log(localStorage.getItem("user"))}

                    {selectedFlight ? (
                        user.roles === "Pilot" ? (
                            <FlightCrewPilot flightId={selectedFlight.id} />
                        ) : user.roles === "Flight Attendant" ? (
                            <FlightCrew flightId={selectedFlight.id} />
                        ) : (
                            <p>You do not have access to this information.</p>
                        )
                    ) : (
                        <p>Loading flight details...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>



            <Footer className="footer" />

        </div>
    );
}

export default EmployeeFlightsPage;
