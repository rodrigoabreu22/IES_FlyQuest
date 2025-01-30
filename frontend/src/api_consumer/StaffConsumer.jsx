import URL_CONFIG from "../config";

const base_url = URL_CONFIG.API_URL + '/staff';

const staff_api = {
    // Fetch all employees, optionally filtered by role
    fetchEmployees: async (role = null) => {
        const url = role ? `${base_url}/all?role=${role}` : `${base_url}/all`;
        const response = await fetch(url);
        return await response.json();
    },

    // Fetch a single employee by ID
    fetchEmployeeById: async (id) => {
        const response = await fetch(`${base_url}/${id}`);
        return await response.json();
    },

    // Update an existing employee by ID
    updateEmployee: async (id, updatedEmployee) => {
        const response = await fetch(`${base_url}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedEmployee)
        });
        return await response.json();
    },

    // Fetch all flights associated with an employee by employee ID
    fetchEmployeeFlights: async (id) => {
        const response = await fetch(`${base_url}/${id}/flights`);
        return await response.json();
    },

};

export default staff_api;
