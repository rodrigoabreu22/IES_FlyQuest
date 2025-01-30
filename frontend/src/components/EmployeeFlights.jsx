import React, { useState, useEffect } from "react";
import { Row, Col, Form, Card, Container } from "react-bootstrap";
import FlightCard from "./FlightCard"; 
import staff_api from "../api_consumer/StaffConsumer"; 

const EmployeeFlights = ({ employeeId }) => {
    const [flights, setFlights] = useState([]);
    const [filteredFlights, setFilteredFlights] = useState([]);
    const [flightFilter, setFlightFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const flightsData = await staff_api.fetchEmployeeFlights(employeeId);
                setFlights(flightsData);
                setFilteredFlights(flightsData);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch flights.");
                setLoading(false);
            }
        };

        if (employeeId) {
            fetchFlights();
        }
    }, [employeeId]);

    const handleFilterChange = (e) => {
        const selectedFilter = e.target.value;
        setFlightFilter(selectedFilter);

        if (selectedFilter === "ALL") {
            setFilteredFlights(flights);
        } else {
            setFilteredFlights(flights.filter(flight => flight.status === selectedFilter));
        }
    };

    if (loading) {
        return <div>Loading flights...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Container className="mt-4">
            <Card>
                <Card.Body>
                    <Row>
                        <Col md={12}>
                            <strong>Flights Information</strong>
                            <Form.Select
                                aria-label="Filter flights"
                                value={flightFilter}
                                onChange={handleFilterChange}
                                className="mt-2"
                            >
                                <option value="ALL">All Flights</option>
                                <option value="SCHEDULED">Scheduled</option>
                                <option value="IN PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELED">Canceled</option>
                            </Form.Select>
                        </Col>
                    </Row>

                    <Row className="mt-2 flex-column">
                        {filteredFlights.length > 0 ? (
                            filteredFlights.map(flight => (
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
                            ))
                        ) : (
                            <Col md={12}>
                                <p>No flights found based on the selected filter.</p>
                            </Col>
                        )}
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EmployeeFlights;
