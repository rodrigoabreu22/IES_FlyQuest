import React from "react";
import NewFlightForm from "../components/NewFlightForm";
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import '../css/Layout.css'; 

function AddFlight() {
    return (
        <div id="root">
            <Navbar />
            <div className="content">
                <NewFlightForm />
            </div>
            <Footer />
        </div>
    );
}

export default AddFlight;
