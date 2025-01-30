import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, ListGroup, Button, Modal, Form } from 'react-bootstrap';
import staff_api from '../api_consumer/StaffConsumer';
import "../css/EmployeeInfo.css";


const EmployeeInfo = ({ employeeId }) => {
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedEmployee, setEditedEmployee] = useState(null); 
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                setLoading(true);
                const data = await staff_api.fetchEmployeeById(employeeId);
                setEmployee(data);
                setEditedEmployee(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch employee data');
                setLoading(false);
            }
        };

        if (employeeId) {
            fetchEmployee();
        }
    }, [employeeId]);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedEmployee((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedData = await staff_api.updateEmployee(employee.id, editedEmployee);
            setEmployee(updatedData);
            setIsEditing(false);
            alert('Employee information updated successfully!');
        } catch (error) {
            console.error('Error updating employee:', error);
            alert('Failed to update employee information.');
        }
    };

    const handleRemoveEmployee = async () => {
        try {
            const flights = await staff_api.fetchEmployeeFlights(employee.id);
    
            const hasActiveFlights = flights.some(
                (flight) => flight.status === "SCHEDULED" || flight.status === "IN PROGRESS"
            );
    
            if (hasActiveFlights) {
                alert("Employee has ongoing or scheduled flights and cannot be removed.");
                return;
            }
    
            const updatedEmployee = { ...employee, active: false };
            await staff_api.updateEmployee(employee.id, updatedEmployee);
            setEmployee(updatedEmployee);
            setShowModal(false);
            alert("Employee status updated to inactive.");
        } catch (error) {
            console.error("Error removing employee:", error);
            alert("Failed to remove employee.");
        }
    };
    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Container className="my-4">
            <Card>
                <Card.Body>
                    <Card.Title>Employee Information</Card.Title>

                    {/* Display either the employee info or the edit form */}
                    {isEditing ? (
                        // Edit Mode Form
                        <Form onSubmit={handleEditSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="firstName"
                                            value={editedEmployee.firstName}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="lastName"
                                            value={editedEmployee.lastName}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={8}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            value={editedEmployee.address}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Zip</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="zip"
                                            value={editedEmployee.zip}
                                            onChange={handleEditChange}
                                            pattern="\d{4}-\d{3}"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Phone</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            name="phone"
                                            value={editedEmployee.phone}
                                            onChange={handleEditChange}
                                            pattern="\d{9}"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={editedEmployee.email}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Gender</Form.Label>
                                        <div>
                                            <Form.Check
                                                inline
                                                label="Male"
                                                type="radio"
                                                name="gender"
                                                value="Male"
                                                checked={editedEmployee.gender === "Male"}
                                                onChange={handleEditChange}
                                            />
                                            <Form.Check
                                                inline
                                                label="Female"
                                                type="radio"
                                                name="gender"
                                                value="Female"
                                                checked={editedEmployee.gender === "Female"}
                                                onChange={handleEditChange}
                                            />
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Age</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="age"
                                            value={editedEmployee.age}
                                            onChange={handleEditChange}
                                            min="18"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            {/* Read-only Role and Start Date */}
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Role</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="role"
                                            value={editedEmployee.role}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Start Date</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="startDate"
                                            value={new Date(editedEmployee.startDate).toLocaleDateString('en-GB')}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button variant="success" type="submit">Save Changes</Button>
                            <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                        </Form>
                    ) : (
                        // View Mode: Display employee details
                        <Row>
                            <Col md={6}>
                                <ListGroup variant="flush">
                                    <ListGroup.Item><strong>First Name:</strong> {employee.firstName}</ListGroup.Item>
                                    <ListGroup.Item><strong>Last Name:</strong> {employee.lastName}</ListGroup.Item>
                                    <ListGroup.Item><strong>Address:</strong> {employee.address}</ListGroup.Item>
                                    <ListGroup.Item><strong>Zip:</strong> {employee.zip}</ListGroup.Item>
                                    <ListGroup.Item><strong>Phone:</strong> {employee.phone}</ListGroup.Item>
                                    <ListGroup.Item><strong>Email:</strong> {employee.email}</ListGroup.Item>
                                </ListGroup>
                            </Col>
                            <Col md={6}>
                                <ListGroup variant="flush">
                                    <ListGroup.Item><strong>Gender:</strong> {employee.gender}</ListGroup.Item>
                                    <ListGroup.Item><strong>Age:</strong> {employee.age}</ListGroup.Item>
                                    <ListGroup.Item><strong>Role:</strong> {employee.role}</ListGroup.Item>
                                    <ListGroup.Item><strong>Status:</strong> {employee.active ? "Active" : "Inactive"}</ListGroup.Item>
                                    <ListGroup.Item><strong>Joined: </strong>{new Date(employee.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>
                    )}

                    {/* Action Buttons */}
                    {!isEditing && (
                        <Row>
                            <Col md={8}></Col>
                            {user.roles === 'Admin' && (
                                <Col md={2}>
                                    <Button variant="secondary" className="mt-3 same-height-btn" onClick={() => setIsEditing(true)}>
                                        Edit Employee
                                    </Button>
                                </Col>
                            )}
                            {user.roles === 'Admin' && (
                                <Col md={2}>
                                    <Button variant="danger" className="mt-3 same-height-btn" onClick={() => setShowModal(true)}>
                                        Remove Employee
                                    </Button>
                                </Col>
                            )}   
                    </Row>
                    )}
                </Card.Body>
            </Card>

            {/* Remove Confirmation Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Removal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to mark this employee as inactive? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleRemoveEmployee}>
                        Confirm Removal
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default EmployeeInfo;
