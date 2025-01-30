import React, { useEffect, useState } from 'react';
import { Row } from 'react-bootstrap';
import FlightConsumer from '../api_consumer/FlightConsumer';
import '../css/SeatPlan.css';

const SeatPlan = ({ flightId, classType }) => {
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSeats = async () => {
        try {
            console.log(`Fetching seats for flightId: ${flightId}, classType: ${classType}`);
            const seatData = await FlightConsumer.fetchFligthSeatsByClass(flightId, classType);
            setSeats(seatData || []);
        } catch (error) {
            console.error('Error fetching seats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSeats();

        const interval = setInterval(fetchSeats, 60000);

        return () => clearInterval(interval);
    }, [flightId, classType]);

    if (loading) {
        return <div>Loading seats...</div>;
    }

    if (!seats || seats.length === 0) {
        return <div>No seats available for {classType} class.</div>;
    }

    const rows = [...new Set(seats.map(seat => seat.row))];
    const seatRows = rows.map(rowNumber => {
        return seats.filter(seat => seat.row === rowNumber).sort((a, b) => a.letter.localeCompare(b.letter));
    });

    return (
        <div className="seat-plan-Business">
            <h4><strong>Flight Seat Plan</strong> <small>/ {classType}</small></h4>
            <div className="seat-overlay">
                {seatRows.map((row, rowIndex) => (
                    <Row key={rowIndex} className="justify-content-center">
                        {row.map((seat) => (
                            <div key={seat.id} className="seat-Business">
                                <img
                                    src={seat.available ? "media/seatava1.png" : "media/seatuna1.png"}
                                    alt={seat.available ? "Available" : "Reserved"}
                                    className="seat-image-Business"
                                />
                            </div>
                        ))}
                    </Row>
                ))}
            </div>
            {/* Legend */}
            <div className="seat-legend">
                <div className="legend-item">
                    <img src="media/seatava1.png" alt="Available" className="legend-icon" /> <strong>Available</strong>
                </div>
                <div className="legend-item">
                    <img src="media/seatuna1.png" alt="Reserved" className="legend-icon" /> <strong>Reserved</strong>
                </div>
            </div>
        </div>
    );
};

export default SeatPlan;
