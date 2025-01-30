import React, { useEffect, useState } from 'react';
import CustomNavbar from '../components/Navbar';
import '../css/FlightManagement.css';
import WeatherDisplay from '../components/WeatherDisplay';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import EmployeeTable from '../components/EmployeeTable';
import FlightConsumer from '../api_consumer/FlightConsumer';
import FlightSeatPlanB from '../components/FlightSeatPlanB';
import FlightSeatPlanE from '../components/FlightSeatPlanE';
import { BsBorder } from 'react-icons/bs';
import WeatherUpdateButton from '../components/WeatherUpdateButton';
import WeatherAlert from '../components/WeatherAlert';
import Footer from '../components/Footer';

const FlightManagement = () => {
    const [flight, setFlight] = useState({});
    const [departureCity, setDepartureCity] = useState('');
    const [arrivalCity, setArrivalCity] = useState('');
    const [weatherRefreshKey, setWeatherRefreshKey] = useState(0); // Add refresh key state
    const [planeId, setPlaneId] = useState('');
    const [aircraftModel, setAircraftModel] = useState('');
    const [occupationBusiness, setOccupationBusiness] = useState(0);
    const [occupationEconomic, setOccupationEconomic] = useState(0);
    const [status, setStatus] = useState('');
    const [crew, setCrew] = useState({});
    const [showBusinessModal, setShowBusinessModal] = useState(false); 
    const [showEconomyModal, setShowEconomyModal] = useState(false);
    const [departureCountry, setDepartureCountry] = useState('');
    const [arrivalCountry, setArrivalCountry] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [cancelFlight, setCancelFlight] = useState(false);


    const flightId = localStorage.getItem('flightId');
    localStorage.setItem('departureCity', departureCity);
    localStorage.setItem('arrivalCity', arrivalCity);

    const handleWeatherAlert = (alertStatus) => {
        setShowAlert(alertStatus);
    };

    useEffect(() => {
        const fetchFlightData = async () => {
            const flightData = await FlightConsumer.fetchFlightById(flightId);
            setFlight(flightData);

            setDepartureCity(flightData.departureCity);
            setArrivalCity(flightData.arrivalCity);
            setStatus(flightData.status);
            setCrew(flightData.crew);
            setPlaneId(flightData.plane);
            setDepartureCountry(flightData.departureCountry);
            setArrivalCountry(flightData.arrivalCountry);
            console.log(flightData)
            
        };

        const fetchSeatData = async () => {
            const businessData = await FlightConsumer.fetchOccupiedSeatsByClass(flightId, 'Business');
            const economyData = await FlightConsumer.fetchOccupiedSeatsByClass(flightId, 'Economic');

            setOccupationBusiness(businessData);
            setOccupationEconomic(economyData);
        };

        fetchFlightData();
        fetchSeatData();

        const interval = setInterval(() => {
            fetchFlightData();
            fetchSeatData();
        }, 120000);
    
        return () => clearInterval(interval);

    }, [flightId, cancelFlight]);

    const refreshWeatherData = () => setWeatherRefreshKey((prevKey) => prevKey + 1); // Increment refresh key

    return (
        <div id="root">
            <CustomNavbar />
            <div className="content">
            <Container className="flight-management-container">
                <h1><strong>Flight Management</strong> / <span className="flight-number">FLIGHT {flightId}</span></h1>

                <WeatherAlert showAlert={showAlert} />
                
                <Row className="flight-box">
                    <Col lg={6} md={12}>
                        <Card className="inner-box">
                            <Card.Body>
                                <div className="flight-info">
                                    <div className="different-item"><strong>{departureCountry} - {arrivalCountry}</strong></div>
                                    <div className="info-item"><i className="fas fa-plane-departure"></i> <strong>Departure City:</strong> {departureCity}</div>
                                    <div className="info-item"><i className="fas fa-plane-arrival"></i> <strong>Arrival City:</strong> {arrivalCity}</div>
                                    <div className="info-item"><i className="fas fa-calendar-alt"></i> <strong>Date:</strong> {flight.departureDate} → {flight.arrivalDate}</div>
                                    <div className="info-item">
                                        <i className="fas fa-info-circle"></i> 
                                        <strong>Status:</strong> 
                                        <span style={{ 
                                            color: status === "CANCELED" ? "red" : "normal", 
                                            fontWeight: status === "CANCELED" ? "bold" : "normal" 
                                        }}>
                                            {status}
                                        </span>
                                    </div>
                                    <div className="info-item"><i className="fas fa-users"></i> <strong>Occupation Business:</strong> {occupationBusiness} seats filled</div>
                                    <div className="info-item"><i className="fas fa-users"></i> <strong>Occupation Economy:</strong> {occupationEconomic} seats filled</div>
                                    <div className="info-item"><i className="fas fa-plane"></i> <strong>Airplane ID:</strong> {planeId}</div>
                                </div>
                            </Card.Body>
                        </Card>
                        <div className="seat-buttons">
                            <h3 className="seat-title">Seats</h3>
                            <Button 
                                variant="outline-warning" 
                                className="seat-btn economy-btn"
                                onClick={() => setShowEconomyModal(true)} 
                            >
                                Economy
                            </Button>
                            <Button 
                                variant="outline-primary" 
                                className="seat-btn business-btn"
                                onClick={() => setShowBusinessModal(true)} 
                            >
                                Business
                            </Button>
                        </div>
                    </Col>

                    <Col lg={6} md={12} className="right-side">
                        <Card className="employees-box mb-3">
                            <Card.Body>
                                <div className="employee-table-wrapper">
                                    <EmployeeTable id={flightId} />
                                </div>
                            </Card.Body>
                        </Card>


                        <Card className="weather-box mb-3">
                            <Card.Body>
                                <div className="weather-table-wrapper">
                                    <WeatherDisplay 
                                            refreshKey={weatherRefreshKey} 
                                            onExceedLimits={handleWeatherAlert} 
                                        />
                                </div>
                            </Card.Body>
                        </Card>

                        <div className="action-buttons-container">
                        <WeatherUpdateButton
                                cities={[departureCity, arrivalCity]}
                                onWeatherUpdate={refreshWeatherData}
                        />
                        <Button
                            variant="danger"
                            className="cancel-btn"
                            onClick={async () => {
                                await FlightConsumer.cancelFlight(flightId);
                                alert('Flight cancelled successfully');
                                setCancelFlight(true);
                                window.location.reload();
                            }}
                            disabled={status !== "SCHEDULED"}
                        >
                            Cancel Flight
                        </Button>
                        
                    </div>

                    </Col>
                </Row>




                <Modal 
                    show={showBusinessModal} 
                    onHide={() => setShowBusinessModal(false)} 
                    centered 
                    size="xl" 
                    className="custom-wide-modal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Business Class Seat Plan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="seat-plan-container">
                            <FlightSeatPlanB flightId={flightId} />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowBusinessModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal 
                    show={showEconomyModal} 
                    onHide={() => setShowEconomyModal(false)} 
                    centered 
                    size="xl" 
                    className="custom-wide-modal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Economic Class Seat Plan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="seat-plan-container">
                            <FlightSeatPlanE flightId={flightId} />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEconomyModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>



            </Container>
            </div>
            <Footer />
        </div>
    );
};

export default FlightManagement;