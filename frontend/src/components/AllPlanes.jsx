import React, { useEffect, useState } from "react";
import { Container, Row, Col, FormControl, Button, Modal, InputGroup } from "react-bootstrap";
import PlaneConsumer from "../api_consumer/PlaneConsumer";
import PlaneCard from "./PlaneCard";

const AllPlanes = () => {
    const [planes, setPlanes] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchPlanes = async () => {
            const response = await PlaneConsumer.fetchPlanes();
            setPlanes(response);
        };

        fetchPlanes();
    }, []);

    const handleSearchChange = (e) => {
        setSearch(e.target.value.toLowerCase());
    };

    const handleCreatePlane = async () => {
        try {
            await PlaneConsumer.addPlane();

            const updatedPlanes = await PlaneConsumer.fetchPlanes();
            setPlanes(updatedPlanes);
            setShowModal(false); 
        } catch (error) {
            console.error("Error creating plane:", error);
            alert("An error occurred while creating the plane.");
        }
    };

    const filteredPlanes = planes.filter((plane) =>
        String(plane.id).toLowerCase().includes(search)
    );

    return (
        <Container className="mt-4">
            <Row className="mb-4">
                <Col>
                    <h3 className="text-center display-4">Planes</h3>
                </Col>
            </Row>
            <Row className="mb-4 align-items-center">
                <Col xs={12} md={2}>
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(true)}
                        style={{
                            height: "calc(1.5em + 0.75rem + 2px)", // Altura padrão
                            marginTop: "0px",
                            width: "200px",
                            paddingTop: "7px",
                        }}
                    >
                        Add New Plane
                    </Button>
                </Col>
                <Col xs={12} md={{ span: 6, offset: 4 }}>
                    <InputGroup>
                        <FormControl
                            type="text"
                            placeholder="Search by Plane ID"
                            value={search}
                            onChange={handleSearchChange}
                            style={{
                                height: "calc(1.5em + 0.75rem + 2px)", // Altura igual ao botão
                            }}
                        />
                    </InputGroup>
                </Col>
            </Row>
            <Row>
                {filteredPlanes.map((plane) => (
                    <Col md={6} lg={6} key={plane.id} className="mb-4">
                        <PlaneCard
                            id={plane.id}
                            businessSeats={plane.businessSeats}
                            economicSeats={plane.economicSeats}
                        />
                    </Col>
                ))}
            </Row>

            {/* Modal for Adding a New Plane */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Plane Creation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to add a new plane with 30 business and 90 economic seats?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="secondary" onClick={handleCreatePlane}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AllPlanes;
