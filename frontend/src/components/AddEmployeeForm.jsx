import React, { useState } from 'react';
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap';
import AuthConsumer from '../api_consumer/AuthConsumer';
import '../css/NewEmployeeForm.css';

const NewEmployeeForm = () => {
    const [formValues, setFormValues] = useState({
        firstName: "",
        lastName: "",
        address: "",
        zip: "",
        phone: "",
        email: "",
        password: "",
        gender: "",
        role: "",
        age: ""
    });
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await AuthConsumer.createAccount(formValues);
    
            if (response && response.id) {
                console.log("Employee added successfully:", response);
    
                alert("Employee added successfully!");
    
                setFormValues({
                    firstName: "",
                    lastName: "",
                    address: "",
                    zip: "",
                    phone: "",
                    email: "",
                    password: "",
                    gender: "",
                    role: "",
                    age: "",
                });
            } else {
                console.error("Unexpected response:", response);
                alert("An unexpected error occurred while adding the employee.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred while submitting the form.");
        }
    };
    


    return (
        <Container className="my-4 employeesform">
            <Card>
                <Card.Body> 
                    <h3 className="mb-4">New Employee</h3>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formFirstName">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        value={formValues.firstName}
                                        onChange={handleChange}
                                        placeholder="Enter first name"
                                        required
                                         />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formLastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        value={formValues.lastName}
                                        onChange={handleChange}
                                        placeholder="Enter last name"
                                        required />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={8}>
                                <Form.Group className="mb-3" controlId="formAddress">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={formValues.address}
                                        onChange={handleChange}
                                        placeholder="Enter address"
                                        required />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="formZip">
                                    <Form.Label>Zip</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="zip"
                                        value={formValues.zip}
                                        onChange={handleChange}
                                        placeholder="Ex: 1234-123"
                                        pattern="\d{4}-\d{3}"
                                        required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3" controlId="formPhone">
                                    <Form.Label>Contact Phone</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phone"
                                        value={formValues.phone}
                                        onChange={handleChange}
                                        placeholder="Ex: 912345678"
                                        pattern="\d{9}"
                                        required />
                                    </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formValues.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                required />
                        </Form.Group>
                        </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formValues.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                required />
                        </Form.Group>
                        </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Sex</Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    label="Male"
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    checked={formValues.gender === "Male"}
                                    onChange={handleChange} />
                                <Form.Check
                                    inline
                                    label="Female"
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    checked={formValues.gender === "Female"}
                                    onChange={handleChange} />
                            </div>
                        </Form.Group>
                        </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3" controlId="formAge">
                                    <Form.Label>Age</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="age"
                                        value={formValues.age}
                                        onChange={handleChange}
                                        min="18"
                                        placeholder="Enter age"
                                        required />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Roles</Form.Label>
                                    <div>
                                        <Form.Check
                                            inline
                                            label="Flight Attendant"
                                            type="radio"
                                            name="role"
                                            value="Flight Attendant"
                                            checked={formValues.role === "Flight Attendant"}
                                            onChange={handleChange} />
                                        <Form.Check
                                            inline
                                            label="Pilot"
                                            type="radio"
                                            name="role"
                                            value="Pilot"
                                            checked={formValues.role === "Pilot"}
                                            onChange={handleChange} />
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="success" type="submit" className="w-100">
                            SUBMIT
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default NewEmployeeForm;
