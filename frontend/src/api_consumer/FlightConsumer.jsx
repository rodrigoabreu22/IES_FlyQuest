import URL_CONFIG from "../config";

let API_URL = URL_CONFIG.API_URL + '/flight';

const FlightConsumer = {
    fetchFlights: async () => {
        try {
            let response = await fetch(`${API_URL}/all`);
            let data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Error:', error);
        }
    },

    fetchFlightById: async (id) => {
        try {
            let response = await fetch(`${API_URL}/${id}`);
            let data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Error:', error);
        }
    },

    addFlight: async (flight) => {
        try {
            let response = await fetch(`${API_URL}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(flight)
            });
            let data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Error:', error);
        }
    },

    updateFlight: async (id, flight) => {
        try {
            let response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(flight)
            });
            let data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Error:', error);
        }
    },

    cancelFlight: async (id) => {
        try {
            let response = await fetch(`${API_URL}/${id}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Error:', error);
        }
    },

    fetchFlightPilots: async (id) => {
        try {
            let response = await fetch(`${API_URL}/${id}/pilots`);
            let data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Error:', error);
        }
    },

    fetchFligthAttendants: async (id) => {
        try {
            let response = await fetch(`${API_URL}/${id}/attendants`);
            let data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Error:', error);
        }
    },

    fetchFlightPlane: async (id) => {
        try {
            let response = await fetch(`${API_URL}/${id}/plane`);
            let data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Error:', error);
        }
    },

    fetchDepartureCity: async (id) => {
        try {
            let response = await fetch(`${API_URL}/${id}/departCity`);
            let data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Error:', error);
        }
    },

    fetchArrivalCity: async (id) => {
        try {
            let response = await fetch(`${API_URL}/${id}/arrivalCity`);
            let data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Error:', error);
        }
    },

    updateFlightCrew: async (id, crew, employee_id) => {
        try {
            let response = await fetch(`${API_URL}/${id}/crew/${employee_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(crew)
            });
            let data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Error:', error);
        }
    },

    fetchFligthSeats: async (id) => {
        try {
            let response = await fetch(`${API_URL}/${id}/seats`);
            let data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Error:', error);
        }
    },

    fetchFligthSeatsByClass: async (id, classType) => {
        try {
            let response = await fetch(`${API_URL}/${id}/seats?flightClass=${classType}`);
            let data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Error:', error);
        }
    },

    fetchFlightSeatsAvailable: async (id) => {
        try {
            let response = await fetch(`${API_URL}/${id}/seats/available`);
            let data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Error:', error);
        }
    },

    updateFlightSeat: async (id, seat) => {
        try {
            let response = await fetch(`${API_URL}/${id}/seat`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(seat)
            });
            let data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Error:', error);
        }
    },

    fetchOccupiedSeatsByClass: async (id, classType) => {
        try {
            let response = await fetch(`${API_URL}/${id}/seats/${classType}/occupied`);
            let data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Error:', error);
        }
    }
};

export default FlightConsumer;