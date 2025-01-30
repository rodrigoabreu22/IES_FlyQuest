const isMachine = window.location.hostname === 'localhost';

const URL_CONFIG = {
    API_URL: isMachine 
        ? 'http://localhost:8090/api/v1'
        : 'http://deti-ies-05.ua.pt:8090/api/v1'
};

export default URL_CONFIG;