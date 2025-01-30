import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Badge, Button, Offcanvas } from 'react-bootstrap';
import { FaEnvelope, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import '../css/CustomNavbar.css';
import StaffConsumer from '../api_consumer/StaffConsumer';
import NotificationConsumer from '../api_consumer/NotificationConsumer';

const CustomNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user_data, setUser_data] = useState([]);
  const [notification, setNotification] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await StaffConsumer.fetchEmployeeById(user.id);
      setUser_data(response);
    }

    const fetchNotifications = async () => {
      const response = await NotificationConsumer.fetchNotificationsByUserId(user.id);
      setNotification(response);
    }

    fetchEmployees();
    fetchNotifications();
  }, []);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  }

  const handleEmployees = () => {
    navigate('/employeesList');
  }

  const handleSchedule = () => {
    if (user_data.role === 'Admin') {
      navigate('/adminDashboard');
    }
    else {
      navigate('/staffDashboard');
    }
  }

  const handleUserAccount = () => {
    if (user_data.role !== 'Admin') {
      navigate('/employeeAccount');
    }
  }

  const handleNotification = () => {
    navigate('/notifications');
  }

  const handlePlanes = () => {
    navigate('/allPlanes');
  }

  const notificationsToRead = notification.filter((notification) => notification.beenRead === false).length;

  return (
    <Navbar expand="lg" expanded={isMenuOpen} className="custom-navbar shadow-sm px-3">
      <Container fluid className="d-flex justify-content-between align-items-center">
        {/* Logo */}
        <Navbar.Brand href="#home" className="brand-logo-container">
          <img src="media/logo_final.png" alt="FLYQUEST Logo" className="brand-logo" />
        </Navbar.Brand>

        {/* Toggle para Offcanvas apenas para telas menores */}
        <Button
          variant="light"
          className="navbar-toggler d-lg-none"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </Button>

        {/* Offcanvas para telas menores */}
        <Offcanvas
          show={isMenuOpen}
          onHide={closeMenu}
          placement="end"
          className="custom-offcanvas d-lg-none"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {/* Links de navegação */}
            <Nav className="flex-column">
              <Nav.Link href="#schedule" className="button-nav" onClick={handleSchedule}>
                Schedule
              </Nav.Link>
              {user_data.role === 'Admin' &&
                <Nav.Link href="#employees" className="button-nav" onClick={handleEmployees}>
                  Employees
                </Nav.Link>
              }
              <Nav.Link href="#planes" className="button-nav" onClick={handlePlanes}>
                Planes
              </Nav.Link>
            </Nav>

            {/* Notificações e Perfil */}
            <Nav className="flex-column mt-3">
              <Nav.Link href="#profile" className="d-flex align-items-center profile-link" onClick={closeMenu}>
                <div className="notification-container">
                  {user_data.role !== 'Admin' && (
                    <>
                      <FaEnvelope className="icon-custom"  onClick={handleNotification}/>
                      <Badge bg="danger" pill className="notification-badge">{notificationsToRead}</Badge>
                    </>
                  )}
                </div>
                <FaUserCircle className="icon-custom2 me-2" onClick={handleUserAccount}/>
                <span className="nav-text user-name" onClick={handleUserAccount}>{user_data.firstName} ({user_data.role})</span>
              </Nav.Link>

              {/* Botão de Log out */}
              <Button variant="outline-light" className="logout-link" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" /> Log out
              </Button>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Navbar Collapse para telas maiores */}
        <Navbar.Collapse id="navbar-content" className="d-none d-lg-flex justify-content-between">
          {/* Links de navegação */}
          <Nav className="d-flex align-items-center gap-4">
            <Nav.Link href="#schedule" className="button-nav" onClick={handleSchedule}>
              Schedule
            </Nav.Link>
            {user_data.role === 'Admin' &&
              <>
              <Nav.Link href="#employees" className="button-nav" onClick={handleEmployees}>
                Employees
              </Nav.Link>
              <Nav.Link href="#planes" className="button-nav" onClick={handlePlanes}>
                Planes
              </Nav.Link>
              </>
            }
          </Nav>

          {/* Notificações e Perfil */}
          <Nav className="d-flex align-items-center gap-3">
            <Nav.Link href="#profile" className="d-flex align-items-center profile-link">
              <div className="notification-container">
                {user_data.role !== 'Admin' && (
                  <>
                    <FaEnvelope className="icon-custom" onClick={handleNotification}/>
                    <Badge bg="danger" pill className="notification-badge">{notificationsToRead}</Badge>
                  </>
                )}
              </div>
              <FaUserCircle className="icon-custom2 me-2" onClick={handleUserAccount}/>
              <span className="nav-text user-name" onClick={handleUserAccount}>{user_data.firstName} ({user_data.role})</span>
            </Nav.Link>

            {/* Botão de Log out */}
            <Button variant="outline-light" className="logout-link" onClick={handleLogout}>
              <FaSignOutAlt className="me-2" /> Log out
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
