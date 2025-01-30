import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Offcanvas } from "react-bootstrap";
import FlightCard from "./FlightCard";
import FlightConsumer from "../api_consumer/FlightConsumer";
import PlaneConsumer from "../api_consumer/PlaneConsumer";
import { useNavigate } from "react-router-dom";

function AllFlights() {
    const today = new Date().toISOString().split("T")[0]; 
    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchFlights = async () => {
            const response = await FlightConsumer.fetchFlights();
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
            day: "",
            departureCity: "",
            arrivalCity: "",
            flightState: "All",
            planeId: "", 
            search: "",
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

        if (order.field) {
            updatedFlights = [...updatedFlights].sort((a, b) => {
                if (a[order.field] < b[order.field]) return order.ascending ? -1 : 1;
                if (a[order.field] > b[order.field]) return order.ascending ? 1 : -1;
                return 0;
            });
        }

        setFilteredFlights(updatedFlights);
    };

    const handleAddFlight = () => {
        navigate("/addFlight");
    };

    return (
        <>
            <Container style={{ paddingTop: "30px" }}>
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

                    <Col sm={9}>
                        <Row className="mb-3 align-items-center">
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Search by Flight ID"
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    style={{
                                        zIndex: 10,
                                        position: "relative",
                                        height: "calc(1.5em + 0.75rem + 2px)"
                                    }}
                                />
                            </Col>
                            <Col xs="auto">
                                <Button variant="secondary" onClick={handleAddFlight} style={{ marginTop: "0px",paddingTop:"6px",height: "calc(1.5em + 0.75rem + 2px)" }}>Add Flight</Button>
                            </Col>
                        </Row>
                        {filteredFlights.map((flight) => (
                            <FlightCard 
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
        </>
    );
}

export default AllFlights;
