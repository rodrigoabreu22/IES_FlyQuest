import React, { useEffect, useState } from 'react';
import FlightConsumer from '../api_consumer/FlightConsumer'; // Import FlightConsumer
import '../css/FlightCrew.css'; // Import CSS file for styling

const FlightCrewPilot = ({ flightId }) => {
    const [pilots, setPilots] = useState([]);
    const [attendants, setAttendants] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCrewData = async () => {
            try {
                // Fetch pilots
                const pilotsData = await FlightConsumer.fetchFlightPilots(flightId);
                setPilots(pilotsData || []);

                // Fetch flight attendants
                const attendantsData = await FlightConsumer.fetchFligthAttendants(flightId);
                setAttendants(attendantsData || []);
            } catch (err) {
                setError('Failed to load flight crew data.');
                console.error(err);
            }
        };

        fetchCrewData();
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
        </div>
    );
};

export default FlightCrewPilot;
