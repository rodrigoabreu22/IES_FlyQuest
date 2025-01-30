import React from 'react';
import CustomNavbar from '../components/Navbar';
import AllFlights from '../components/AllFlights';
import Footer from '../components/Footer';
import '../css/Layout.css';

const AllFlightsPage = () => {
    return (
        <div id="root">
            <CustomNavbar />
            <div className="content">
                <AllFlights />
            </div>
            <Footer />
        </div>
    );
};

export default AllFlightsPage;