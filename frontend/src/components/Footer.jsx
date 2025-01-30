import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../css/Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light py-5">
      <Container>
        <Row className="align-items-start">
          {/* FlyQuest Info */}
          <Col md={6} className="mb-4">
            <h5 className="fw-bold text-uppercase mb-3 footer-title">FlyQuest</h5>
            <p>
            FlyQuest is a software developed for an airline company that allows the management of operational aspects related to flights. This app is designed for administrators and crew teams, facilitating organization, scheduling, and communication.            </p>
            <Button
              variant="outline-light"
              size="sm"
              href="https://github.com/detiuaveiro/ies-24-25-group-project-105/blob/master/README.md" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-btn"
            >
              More Information
            </Button>
          </Col>

          <Col md={6} className="mb-4 text-md-end">
            <h6 className="fw-bold text-uppercase mb-3 footer-title">Developers</h6>
            <ul className="list-unstyled">
              <li>
                <a
                  href="https://github.com/Marshmallow1119"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Tomás Brás
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/xHuGODx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Hugo Ribeiro
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/odraude23"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Eduardo Lopes
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/rodrigoabreu22"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Rodrigo Abreu
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        {/* Footer Bottom */}
        <Row className="mt-4">
          <Col className="text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} FlyQuest IES-2024 - All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
