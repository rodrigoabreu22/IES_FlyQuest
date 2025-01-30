import React from 'react';
import CustomNavbar from '../components/Navbar';
import AllPlanes from '../components/AllPlanes';
import Footer from '../components/Footer';
import '../css/Layout.css'; 

const Planes = () => {
    return (
        <div id="root">
            <CustomNavbar />
            <div className="content">
                <AllPlanes />
            </div>
            <Footer />
        </div>
    );
};

export default Planes;
