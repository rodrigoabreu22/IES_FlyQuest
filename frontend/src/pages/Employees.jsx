import React from 'react';
import CustomNavbar from '../components/Navbar';
import EmployeeList from '../components/EmployeeList';
import Footer from '../components/Footer';
import '../css/Layout.css'; 

const Employees = () => {
    return (
        <div id="root">
            <CustomNavbar />
            <div className="content">
                <EmployeeList />
            </div>
            <Footer />
        </div>
    );
};

export default Employees;
