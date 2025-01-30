import React, { useState, useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';
import { FaPlaneDeparture, FaPlaneArrival } from 'react-icons/fa';
import FlightConsumer from '../api_consumer/FlightConsumer';
import '../css/SeatsEconomic.css';
import '../css/EconomicFlight.css';

const FlightSeatPlanE = ({ flightId = 1 }) => {
    const [flight, setFlight] = useState(null);
    const [plane, setPlane] = useState(null);
    const [crewDetails, setCrewDetails] = useState({});
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [classType, setClassType] = useState('Economic');

    const fetchFlightDetails = async () => {
        try {
            const flightData = await FlightConsumer.fetchFlightById(flightId);
            setFlight(flightData);

            const planeData = await FlightConsumer.fetchFlightPlane(flightId);
            setPlane(planeData);

            const pilots = await FlightConsumer.fetchFlightPilots(flightData.crew.id);
            const attendants = await FlightConsumer.fetchFligthAttendants(flightData.crew.id);

            const pilotData = pilots.length > 0 ? pilots[0] : null;
            const copilotData = pilots.length > 1 ? pilots[1] : null;

            setCrewDetails({
                pilot: pilotData,
                copilot: copilotData,
                attendants: attendants,
            });

            const seatData = await FlightConsumer.fetchFligthSeatsByClass(flightId, classType);
            setSeats(seatData || []);
        } catch (error) {
            console.error('Error fetching flight or seat details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlightDetails();

        const interval = setInterval(fetchFlightDetails, 120000); 

        return () => clearInterval(interval);
    }, [flightId, classType]);

    if (loading) return <div>Loading...</div>;
    if (!flight || !plane) return <div>Error loading flight data.</div>;

    const { pilot, copilot, attendants } = crewDetails;

    // Organize seats into rows
    const rows = [...new Set(seats.map(seat => seat.row))];
    const seatRows = rows.map(rowNumber => {
        return seats.filter(seat => seat.row === rowNumber).sort((a, b) => a.letter.localeCompare(b.letter));
    });

    return (
        <Container fluid className="py-4">
            <div className="flight-seat-container d-flex flex-wrap justify-content-center">
            <div className="seat-plan-Economic shared-size">
            <h4><strong>Flight Seat Plan</strong> <small>/ {classType}</small></h4>
            <div className="seat-overlay-Economic">
                {/* Identificador de colunas */}
                <div className="row d-flex justify-content-center">
                    <div className="seat-placeholder-Economic"></div> {/* Espaço vazio para alinhar com identificadores de linha */}
                    {Array.from({ length: seatRows[0].length }, (_, colIndex) => (
                        <div key={`col-${colIndex}`} className="column-label-Economic">
                            {String.fromCharCode(65 + colIndex)} {/* A, B, C, ... */}
                        </div>
                    ))}
                </div>
                {seatRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="row d-flex justify-content-center">
                        {/* Identificador de linha */}
                        <div className="row-label-Economic">
                            {rowIndex + 1} {/* 1, 2, 3, ... */}
                        </div>
                        {row.map((seat) => (
                            <div key={seat.id} className="seat-Economic">
                                <img
                                    src={seat.available ? "media/seatava1.png" : "media/seatuna1.png"}
                                    alt={seat.available ? "Available" : "Reserved"}
                                    className="seat-image-Economic"
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
    <div className="seat-legend-Economic mt-4">
        <div className="legend-item mb-2">
            <img src="media/seatava1.png" alt="Available" className="legend-icon" /> <strong>Available</strong>
        </div>
        <div className="legend-item">
            <img src="media/seatuna1.png" alt="Reserved" className="legend-icon" /> <strong>Reserved</strong>
        </div>
    </div>
</div>


                <div className="flight-Economic shared-size">
                    <div className="tabs-container d-flex flex-wrap justify-content-center text-center">
                        <div className="tabs flex-grow-1 mb-3">
                            <strong>{flight.departureCountry}</strong><br />
                            <span>{flight.departureCity}</span>
                            <div className="info-box mt-2 p-2">
                                <FaPlaneDeparture className="me-2 text-black" />
                                <span className="text-black">{new Date(flight.departureDate).toLocaleString()}</span><br />
                                <span className="info-label text-black">Departing</span>
                            </div>
                        </div>
                        <div className="arrow align-self-center mx-2">→</div>
                        <div className="tabs flex-grow-1 mb-3">
                            <strong>{flight.arrivalCountry}</strong><br />
                            <span>{flight.arrivalCity}</span>
                            <div className="info-box mt-2 p-2">
                                <FaPlaneArrival className="me-2 text-black" />
                                <span className="text-black">{new Date(flight.arrivalDate).toLocaleString()}</span><br />
                                <span className="info-label text-black">Arriving</span>
                            </div>
                        </div>
                    </div>

                    <div className="separator-Economic"></div>

                    <h4 className="section-title">Flight Information</h4>
                    <div className="flight-details d-flex flex-wrap">
                        <div className="detail-item flex-grow-1"><strong>Flight ID:</strong><br />{flight.id}</div>
                        <div className="detail-item flex-grow-1"><strong>Airplane ID:</strong><br />{flight.plane}</div>
                        <div className="detail-item flex-grow-1"><strong>Status:</strong><br /> {flight.status}</div>
                        <div className="detail-item flex-grow-1"><strong>Business Seats:</strong><br /> {plane.businessSeats}</div>
                        <div className="detail-item flex-grow-1"><strong>Economic Seats:</strong><br />{plane.economicSeats}</div>
                        <div className="detail-item flex-grow-1"><strong>Total Capacity:</strong><br />{plane.businessSeats + plane.economicSeats} seats</div>
                        <div className="detail-item flex-grow-1"><strong>Occupation Business:</strong><br /> {flight.occupationBusiness} seats</div>
                        <div className="detail-item flex-grow-1"><strong>Occupation Economic:</strong><br />{flight.occupationEconomic} seats</div>
                    </div>

                    <h4 className="section-title">Flight Crew</h4>
                    <div className="flight-crew d-flex flex-wrap">
                        <div className="crew-item text-black"><strong>Pilot:</strong> {pilot ? `${pilot.firstName} ${pilot.lastName}` : 'Pilot not found'}</div>
                        <div className="crew-item text-black"><strong>Co-Pilot:</strong> {copilot ? `${copilot.firstName} ${copilot.lastName}` : 'Co-Pilot not found'}</div>
                        {attendants && attendants.length > 0 ? (
                            attendants.slice(0, 4).map((attendant, index) => (
                                <div className="crew-item text-black" key={index}>
                                    <strong>Attendant:</strong> {`${attendant.firstName} ${attendant.lastName}`}
                                </div>
                            ))
                        ) : (
                            <div className="crew-item text-black">No attendants available.</div>
                        )}
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default FlightSeatPlanE;
