import React from 'react';
import CustomNavbar from '../components/Navbar';
import NewEmployeeForm from '../components/AddEmployeeForm';
import Footer from '../components/Footer';
import '../css/Layout.css'; 

const AddEmployee = () => {
    return (
        <div id="root">
            <CustomNavbar />
            <div className="content">
                <NewEmployeeForm />
            </div>
            <Footer />
        </div>
    );
};

export default AddEmployee;
