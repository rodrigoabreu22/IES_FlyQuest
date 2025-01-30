import URL_CONFIG from "../config";

const API_URL = URL_CONFIG.API_URL + '/auth';

const AuthConsumer = {
    login: async (email, password) => {
        try {
            let response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        email: email,
                        password: password
                    }
                )
            });
            let data = await response.json();
            return data;
        }
        catch (error) {   
            console.log('Error:', error);
        }
    },

    createAccount: async (user) => {
        try {
            let response = await fetch(`${API_URL}/createAccount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            let data = await response.json();
            return data;
        }
        catch (error) {
            console.log('Error:', error);
        }
    },
};

export default AuthConsumer;