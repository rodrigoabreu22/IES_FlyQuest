import React from 'react';
import CustomNavbar from '../components/Navbar';
import EmployeeInfo from '../components/EmployeeInfo';
import EmployeeFlights from '../components/EmployeeFlights';
import Footer from '../components/Footer';
import '../css/Layout.css'; 

const EmployeePage = () => {
    // Obtemos o usuário de forma segura
    const user = JSON.parse(localStorage.getItem('user')) || {};

    return (
        <div id="root">
            <CustomNavbar />
            <div className="content">
                <EmployeeInfo employeeId={user.id} />
                {user.role === 'Admin' && (
                    <EmployeeFlights employeeId={user.id} />
                )}
            </div>
            <Footer />
        </div>
    );
};

export default EmployeePage;
