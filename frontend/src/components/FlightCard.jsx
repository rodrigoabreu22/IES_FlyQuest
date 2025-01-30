import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { FaPlaneDeparture, FaPlaneArrival } from "react-icons/fa";
import "../css/flightCard.css"; 
import PlaneConsumer from "../api_consumer/PlaneConsumer";
import FlightConsumer from "../api_consumer/FlightConsumer";
import { useNavigate } from "react-router-dom";

const formatDate = (date) => {
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    return new Date(date).toLocaleString('en-GB', options);
};

const FlightCard = (props) => {
    const [currentState, setCurrentState] = useState("");
    const [totalSeats, setTotalSeats] = useState(120);
    const [occupation, setOccupation] = useState(0);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const calculateState = () => {
        const now = new Date(); 
        const departureTime = new Date(props.departure_date); 
        const arrivalTime = new Date(props.arrival_date); 

        if (props.status === "CANCELED") {
            if (currentState !== "CANCELED") {
                updateFlightStatus("CANCELED");
            }
            return "CANCELED"; 
        }

        if (now < departureTime) {
            if (currentState !== "SCHEDULED") {
                updateFlightStatus("SCHEDULED");
            }
            return "SCHEDULED"; 
        } 
        else if (now >= departureTime && now < arrivalTime) {
            if (currentState !== "IN PROGRESS") {
                updateFlightStatus("IN PROGRESS");
            }
            return "IN PROGRESS"; 
        } 
        else {
            if (currentState !== "COMPLETED") {
                updateFlightStatus("COMPLETED");
            }
            return "COMPLETED"; 
        }
    };

    const updateFlightStatus = async (state) => {
        try {
            const flight = await FlightConsumer.fetchFlightById(props.id);
            flight.status = state;
            const response = await FlightConsumer.updateFlight(props.id, flight);
            const businessResponse = await FlightConsumer.fetchOccupiedSeatsByClass(props.id, "Business");
            const economicResponse = await FlightConsumer.fetchOccupiedSeatsByClass(props.id, "Economic");

            setOccupation(businessResponse + economicResponse);
        }
        catch (error) {
            console.error("An error occurred while updating the flight status:", error);
        }
    }

    useEffect(() => {
        const updateState = () => {
            const newState = calculateState(); 
            setCurrentState(newState); 
        };

        updateState(); 
        const interval = setInterval(updateState, 60000); 

        return () => clearInterval(interval); 
    }, [props.departure_date, props.arrival_date, props.status]); 

    const getTotalSeats = () => {
        const fetchPlaneById = async () => {
            const response = await PlaneConsumer.fetchPlaneById(props.airplane);
            setTotalSeats(response.businessSeats + response.economicSeats);
        }

        fetchPlaneById();
        return totalSeats;
    }

    const handleFlight = () => {
        if (user.roles === "Admin") {
            localStorage.setItem("flightId", props.id);
            navigate("/flightManagement");
        }
        else {
            props.onClick(props.id);
        }
    }

    return (
        <Container className="mt-3 flights">
            <Card className="p-3 bg-light rounded" onClick={handleFlight}>
                <Card.Body>
                    <h5 className="mb-4">
                        <strong>
                            <FaPlaneDeparture /> FLIGHT {props.departure_country} ➞ {props.arrival_country} <FaPlaneArrival />
                        </strong>
                    </h5>
                    <Row>
                        <Col xs={12} sm={6} md={3}>
                            <strong>DEPARTURE CITY</strong>
                            <p>{props.departureCity}</p>
                            <strong>DATE</strong>
                            <p>{formatDate(props.departure_date)}</p>
                        </Col>
                        <Col xs={12} sm={6} md={3}>
                            <strong>ARRIVAL CITY</strong>
                            <p>{props.arrivalCity}</p>
                            <strong>DATE</strong>
                            <p>{formatDate(props.arrival_date)}</p>
                        </Col>
                        <Col xs={6} sm={4} md={2}>
                            <strong>OCCUPATION</strong>
                            <p>{occupation} / {getTotalSeats()}</p>
                            <strong>AIRPLANE</strong>
                            <p>{props.airplane}</p>
                        </Col>
                        <Col xs={6} sm={4} md={2}>
                        <strong>STATE</strong>
                            {currentState === "CANCELED" ? (
                                <Badge bg="danger">CANCELED</Badge>
                            ) : currentState === "SCHEDULED" ? (
                                <Badge bg="primary">SCHEDULED</Badge>
                            ) : currentState === "IN PROGRESS" ? (
                                <Badge bg="success">IN PROGRESS</Badge>
                            ) : (
                                <Badge bg="secondary">{currentState}</Badge>
                            )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default FlightCard;
