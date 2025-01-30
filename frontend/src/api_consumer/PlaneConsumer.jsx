import URL_CONFIG from "../config";

const base_url = URL_CONFIG.API_URL + '/plane';

const PlaneConsumer = {
    fetchPlanes: async () => {
        const response = await fetch(`${base_url}/all`);
        return await response.json();
    },

    addPlane: async () => {
        const response = await fetch(`${base_url}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"businessSeats": 30, "economicSeats": 90})
        });
        return await response.json();
    },

    fetchPlaneById: async (id) => {
        const response = await fetch(`${base_url}/${id}`);
        return await response.json();
    },

    fetchPlaneFlights: async (id) => {
        const response = await fetch(`${base_url}/${id}/flights`);
        return await response.json();
    },

};

export default PlaneConsumer;
