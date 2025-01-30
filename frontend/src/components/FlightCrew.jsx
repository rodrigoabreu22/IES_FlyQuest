import React, { useEffect, useState } from 'react';
import FlightConsumer from '../api_consumer/FlightConsumer'; // Import FlightConsumer
import '../css/FlightCrew.css'; // Import CSS file for styling

const FlightCrew = ({ flightId }) => {
    const [pilots, setPilots] = useState([]);
    const [attendants, setAttendants] = useState([]);
    const [economicSeats, setEconomicSeats] = useState({ total: 0, booked: 0, free: 0 });
    const [businessSeats, setBusinessSeats] = useState({ total: 0, booked: 0, free: 0 });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCrewAndSeatsData = async () => {
            try {
                // Fetch pilots
                const pilotsData = await FlightConsumer.fetchFlightPilots(flightId);
                setPilots(pilotsData || []);

                // Fetch flight attendants
                const attendantsData = await FlightConsumer.fetchFligthAttendants(flightId);
                setAttendants(attendantsData || []);

                // Fetch seat details for Economic class
                const economicSeatsTotal = await FlightConsumer.fetchFligthSeatsByClass(flightId, 'Economic');
                const economicSeatsBooked = economicSeatsTotal.filter(seat => seat.available === false);
                setEconomicSeats({
                    total: economicSeatsTotal.length,
                    booked: economicSeatsBooked.length || 0,
                    free: economicSeatsTotal.length - (economicSeatsBooked.length || 0),
                });

                // Fetch seat details for Business class
                const businessSeatsTotal = await FlightConsumer.fetchFligthSeatsByClass(flightId, 'Business');
                const businessSeatsBooked = businessSeatsTotal.filter(seat => seat.available === false);
                setBusinessSeats({
                    total: businessSeatsTotal.length,
                    booked: businessSeatsBooked.length || 0,
                    free: businessSeatsTotal.length - (businessSeatsBooked.length || 0),
                });
            } catch (err) {
                setError('Failed to load flight data.');
                console.error(err);
            }
        };

        fetchCrewAndSeatsData();
    }, [flightId]);

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="flight-crew-container container">
            <h3 className="flight-title text-center">FLIGHT {flightId}</h3>
            <div className="crew-info">
                <h4 className="section-title">Flight Crew</h4>
                <div className="row mb-3">
                    <div className="col-4 label">Pilot:</div>
                    <div className="col-8">
                        <input
                            type="text"
                            className="form-control crew-box"
                            value={pilots[0] ? `${pilots[0].firstName} ${pilots[0].lastName}` : 'Not assigned'}
                            readOnly
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-4 label">Copilot:</div>
                    <div className="col-8">
                        <input
                            type="text"
                            className="form-control crew-box"
                            value={pilots[1] ? `${pilots[1].firstName} ${pilots[1].lastName}` : 'Not assigned'}
                            readOnly
                        />
                    </div>
                </div>
                {attendants.map((attendant, index) => (
                    <div className="row mb-3" key={index}>
                        <div className="col-4 label">Flight Attendant:</div>
                        <div className="col-8">
                            <input
                                type="text"
                                className="form-control crew-box"
                                value={`${attendant.firstName} ${attendant.lastName}`}
                                readOnly
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="seats-info">
                <h4 className="section-title">Seats</h4>
                <div className="row">
                    <div className="col-6 text-center">
                        <p><strong>Economic</strong></p>
                        <p>Total seats: {economicSeats.total}</p>
                        <p>Booked: {economicSeats.booked}</p>
                        <p>Free: {economicSeats.free}</p>
                    </div>
                    <div className="col-6 text-center">
                        <p><strong>Business</strong></p>
                        <p>Total seats: {businessSeats.total}</p>
                        <p>Booked: {businessSeats.booked}</p>
                        <p>Free: {businessSeats.free}</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FlightCrew;
