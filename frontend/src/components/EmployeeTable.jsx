import React, { useEffect, useState } from "react";
import { Table, Badge, Button, Modal, Form } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import "../css/employeeTable.css";
import FlightConsumer from "../api_consumer/FlightConsumer";
import StaffConsumer from "../api_consumer/StaffConsumer";

const EmployeeTable = (props) => {
    const [crew, setCrew] = useState([]);
    const [allPilots, setAllPilots] = useState([]);
    const [allAttendants, setAllAttendants] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [replacementOptions, setReplacementOptions] = useState([]);
    const [newCrewMember, setNewCrewMember] = useState(null);
    const [valid, setValid] = useState(false);
    const [flight, setFlight] = useState(null);

    useEffect(() => {
        const fetchCrew = async () => {
            try {
                const pilots = await FlightConsumer.fetchFlightPilots(props.id);
                const attendants = await FlightConsumer.fetchFligthAttendants(props.id);

                setCrew([...pilots, ...attendants]);

                const pilotResponse = await StaffConsumer.fetchEmployees("Pilot");
                const attendantResponse = await StaffConsumer.fetchEmployees("Flight Attendant");
                const flightResponse = await FlightConsumer.fetchFlightById(props.id);

                setAllPilots(pilotResponse);
                setAllAttendants(attendantResponse);
                setFlight(flightResponse);
            } catch (error) {
                console.error("An error occurred while fetching the crew:", error);
            }
        };

        fetchCrew();
        
    }, [props.id]);

    const getStatusIndicator = (active) => {
        return active ? (
            <span className="status-indicator bg-success"></span>
        ) : (
            <span className="status-indicator bg-danger"></span>
        );
    };

    const handleEditClick = (employee) => {
        setSelectedEmployee(employee);
    
        if (employee.role === "Pilot") { 
            setReplacementOptions(allPilots);
        } 
        else if (employee.role === "Flight Attendant") {
            setReplacementOptions(allAttendants);
        }
    
        setShowModal(true);
    };   

    const handleReplacementChange = async (event) => {
        const selectedId = event.target.value;
        const aux = await isValid(selectedId);
        console.log(aux);
        setValid(aux);
        const replacement = replacementOptions.find((emp) => emp.id.toString() === selectedId);
        setNewCrewMember(replacement);
    };

    const isValid = async (id) => {
        const departureDateTime = flight.departureDate;
        const arrivalDateTime = flight.arrivalDate;

        const empFlights = await StaffConsumer.fetchEmployeeFlights(id);
        let invalid = true;

        for (let i = 0; i < empFlights.length; i++) {
            const empFlight = empFlights[i];
            if (empFlight.id === flight.id) {
                invalid = false;
            }
            if (empFlight.departureDate <= arrivalDateTime && empFlight.arrivalDate >= departureDateTime) {
                invalid = false;
            }
        }
        return invalid;
    };

    const handleSaveReplacement = async ()  => {
        if (newCrewMember && valid) {
            const updatedCrew = crew.map((emp) =>
                emp.id === selectedEmployee.id ? { ...newCrewMember, role: emp.role } : emp
            );

            const new_crew = {
                pilot: updatedCrew.filter((emp) => emp.role === "Pilot")[0]?.id || null,
                copilot: updatedCrew.filter((emp) => emp.role === "Pilot")[1]?.id || null,
                attendant1: updatedCrew.filter((emp) => emp.role === "Flight Attendant")[0]?.id || null,
                attendant2: updatedCrew.filter((emp) => emp.role === "Flight Attendant")[1]?.id || null,
                attendant3: updatedCrew.filter((emp) => emp.role === "Flight Attendant")[2]?.id || null,
                attendant4: updatedCrew.filter((emp) => emp.role === "Flight Attendant")[3]?.id || null,
            };
            
            await FlightConsumer.updateFlightCrew(props.id, new_crew, selectedEmployee.id);
            console.log("Crew updated successfully");
            setCrew(updatedCrew);
            
            setShowModal(false);
            setSelectedEmployee(null);
            setNewCrewMember(null);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEmployee(null);
        setNewCrewMember(null);
    }

    return (
        <div className="employee-table-container">
            <Table striped bordered hover className="text-center">
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {crew.length > 0 ? (
                        crew.map((employee) => (
                            <tr key={employee.id}>
                                <td>{`${employee.firstName} ${employee.lastName}`}</td>
                                <td>
                                    <Badge bg="light" text="dark" className="role-badge">
                                        {employee.role}
                                    </Badge>
                                </td>
                                <td>{getStatusIndicator(employee.active)}</td>
                                <td>
                                    <Button
                                        variant="outline-dark"
                                        size="sm"
                                        className="no-margin"
                                        onClick={() => handleEditClick(employee)}
                                        disabled={flight !== null && flight.status !== "SCHEDULED"}
                                    >
                                        <FaEdit />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No crew data available</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Replacement Modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton onClick={handleCloseModal}>
                    <Modal.Title>Replace {selectedEmployee?.firstName} {selectedEmployee?.lastName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="replacementSelect">
                            <Form.Label>Select Replacement</Form.Label>
                            <Form.Select onChange={handleReplacementChange}>
                                <option value="">-- Choose Replacement --</option>
                                {replacementOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.firstName} {option.lastName} ({option.email})
                                    </option>
                                ))}
                            </Form.Select>
                            {newCrewMember && !valid && (
                                <Form.Text className="text-danger">
                                    The selected employee is not available for this flight
                                </Form.Text>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="secondary" onClick={handleSaveReplacement} disabled={!valid}>
                        Save Replacement
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EmployeeTable;
