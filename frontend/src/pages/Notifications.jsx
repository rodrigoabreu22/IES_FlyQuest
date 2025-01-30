import React from 'react';
import Navbar from '../components/Navbar';
import NotificationsList from '../components/NotificationsList';
import Footer from '../components/Footer';
import '../css/Layout.css';

const Notifications = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null; 

  return (
    <div id="root">
    <Navbar />
    <div className="content">
      <NotificationsList userId={userId} />
    </div>
    <Footer />
  </div>
    );
};

export default Notifications;