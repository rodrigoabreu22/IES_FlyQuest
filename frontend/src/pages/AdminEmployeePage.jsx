import React from 'react';
import CustomNavbar from '../components/Navbar';
import EmployeeInfo from '../components/EmployeeInfo';
import EmployeeFlights from '../components/EmployeeFlights';
import Footer from '../components/Footer';
import '../css/Layout.css'; 

function AdminEmployeePage() {
    const id = localStorage.getItem('employee');
    console.log(id);

    return (
        <div id="root">
            <CustomNavbar />
            <div className="content">
                <EmployeeInfo employeeId={id} />
                <EmployeeFlights employeeId={id} />
            </div>
            <Footer />
        </div>
    );
}

export default AdminEmployeePage;
