import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { BsFillAirplaneFill } from "react-icons/bs";
import PlaneConsumer from "../api_consumer/PlaneConsumer";
import CityWeatherConsumer from "../api_consumer/CityWeatherConsumer";
import MapModal from "./PlaneLocationMap";

const PlaneCard = (props) => {
  const [concludedFlights, setConcludedFlights] = useState(0);
  const [scheduledFlights, setScheduledFlights] = useState(0);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [cityCoords, setCityCoords] = useState(null);
  const [mostRecentCity, setMostRecentCity] = useState("");

  useEffect(() => {
    const fetchPlaneFlights = async () => {
      const flights = await PlaneConsumer.fetchPlaneFlights(props.id);

      const concluded = flights.filter((flight) => flight.status === "COMPLETED").length;
      const scheduled = flights.filter(
        (flight) => flight.status === "IN PROGRESS" || flight.status === "SCHEDULED"
      ).length;

      setConcludedFlights(concluded);
      setScheduledFlights(scheduled);

      const recentConcludedFlight = flights
        .filter((flight) => flight.status === "COMPLETED")
        .sort((a, b) => new Date(b.arrivalDate) - new Date(a.arrivalDate))[0];

      if (recentConcludedFlight) {
        setMostRecentCity(recentConcludedFlight.arrivalCity);
      }
    };

    fetchPlaneFlights();
  }, [props.id]);

  const handleShowMap = async () => {
    if (!mostRecentCity) {
      setShowInfoModal(true);
      return;
    }

    try {
      const weatherData = await CityWeatherConsumer.fetchWeatherByCityName(mostRecentCity);

      setCityCoords({
        latitude: weatherData.latitude,
        longitude: weatherData.longitude,
      });

      setShowMapModal(true);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert(`Failed to fetch weather data for city: ${mostRecentCity}`);
    }
  };

  return (
    <Container className="mt-3">
      <Card
        className="shadow border"
        style={{
          backgroundColor: "#ffffff", 
          borderRadius: "10px", 
        }}
      >
        <Card.Body className="p-4">
          {/* Header */}
          <Row className="align-items-center mb-3">
            <Col xs={2} className="text-center">
              <BsFillAirplaneFill size={30} className="text-dark" />
            </Col>
            <Col xs={10}>
              <h5 className="mb-0">
                <strong>PLANE ID: {props.id}</strong>
              </h5>
            </Col>
          </Row>
          <hr className="bg-light" />

          {/* Plane Details */}
          <Row className="mb-3">
            <Col xs={4} className="text-center">
              <p className="mb-1 text-dark">
                <strong>Business Seats</strong>
              </p>
              <p>{props.businessSeats}</p>
            </Col>
            <Col xs={4} className="text-center">
              <p className="mb-1 text-dark">
                <strong>Economic Seats</strong>
              </p>
              <p>{props.economicSeats}</p>
            </Col>
            <Col xs={4} className="text-center">
              <p className="mb-1 text-dark">
                <strong>Total Seats</strong>
              </p>
              <p>{props.businessSeats + props.economicSeats}</p>
            </Col>
          </Row>
          <hr className="bg-light" />

          {/* Flight Statistics */}
          <Row className="text-center">
            <Col xs={6}>
              <p className="mb-1 text-dark">
                <strong>Completed Flights</strong>
              </p>
              <p>{concludedFlights}</p>
            </Col>
            <Col xs={6}>
              <p className="mb-1 text-dark">
                <strong>Scheduled Flights</strong>
              </p>
              <p>{scheduledFlights}</p>
            </Col>
          </Row>
          <hr className="bg-light" />

          {/* Show Map Button */}
          <Row className="text-center">
            <Col>
              <Button variant="outline-success" onClick={handleShowMap}>
                Show Location on Map
              </Button>
            </Col>
          </Row>

          {/* Map Modal */}
          {cityCoords && (
            <MapModal
              latitude={cityCoords.latitude}
              longitude={cityCoords.longitude}
              show={showMapModal}
              onHide={() => setShowMapModal(false)}
            />
          )}

          {/* Info Modal */}
          <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Location Undefined</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                The location of this plane is undefined.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowInfoModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PlaneCard;
