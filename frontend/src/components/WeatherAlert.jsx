import React from 'react';

const WeatherAlert = ({ showAlert }) => {
    if (!showAlert) return null; 

    return (
        <div
            style={{
                backgroundColor: '#ffcccc',
                color: '⁠b30000',
                padding: '15px',
                textAlign: 'center',
                borderRadius: '5px',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                marginBottom: '20px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}
        >
            ⚠️ Alert - Dangerous Weather Conditions! ⚠️
        </div>
    );
};

export default WeatherAlert;
