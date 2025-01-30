import React, { useState, useEffect } from "react";
import staff_api from "../api_consumer/StaffConsumer";
import { Table, Button, Form, Alert, Spinner, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState("");
    const [availabilityFilter, setAvailabilityFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortKey, setSortKey] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const calculateAvailability = (flights) => {
        const now = new Date();
        let resting = false;
        for (const flight of flights) {
            const arrivalDate = new Date(flight.arrivalDate);
            if (flight.status === "IN PROGRESS") return "FLYING";
            if (flight.status === "COMPLETED" && now - arrivalDate < 8 * 60 * 60 * 1000) resting = true;
        }
        if (resting){
            return "RESTING";
        }
        return "AVAILABLE";
    };

    useEffect(() => {
        const fetchEmployeesWithFlights = async () => {
            try {
                setLoading(true);
                const data = await staff_api.fetchEmployees(filterRole);
                //filter data to remove admin
                const emp = data.filter((employee) => employee.role !== "Admin");
                const employeesWithDetails = await Promise.all(
                    emp.map(async (employee) => {
                        const flights = await staff_api.fetchEmployeeFlights(employee.id);
                        const numFlights = flights.length;
                        const availability = calculateAvailability(flights);
                        return { ...employee, numFlights, availability };
                    })
                );
                setEmployees(employeesWithDetails);
                setFilteredEmployees(employeesWithDetails);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching employees or flights:", err);
                setError("Unable to fetch employees or flights.");
                setLoading(false);
            }
        };
        fetchEmployeesWithFlights();
    }, [filterRole]);

    const handleSearchChange = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        filterAndSortEmployees(employees, term, availabilityFilter, filterRole, sortKey, sortOrder);
    };

    const handleRoleFilterChange = (e) => {
        const role = e.target.value;
        setFilterRole(role);
        filterAndSortEmployees(employees, searchTerm, availabilityFilter, role, sortKey, sortOrder);
    };

    const handleAvailabilityFilterChange = (e) => {
        const value = e.target.value;
        setAvailabilityFilter(value);
        filterAndSortEmployees(employees, searchTerm, value, filterRole, sortKey, sortOrder);
    };

    const handleSortChange = (e) => {
        const key = e.target.value;
        setSortKey(key);
        filterAndSortEmployees(employees, searchTerm, availabilityFilter, filterRole, key, sortOrder);
    };

    const handleSortOrderChange = (e) => {
        const order = e.target.value;
        setSortOrder(order);
        filterAndSortEmployees(employees, searchTerm, availabilityFilter, filterRole, sortKey, order);
    };

    const handleAddEmployee = () => {
        navigate("/addEmployee");
    };

    const handleEmployee = (e) => {
        const id = parseInt(e.currentTarget.firstChild.innerText);
        localStorage.setItem("employee", id);
        navigate("/employeeInfo");
    };

    const filterAndSortEmployees = (employees, searchTerm, availability, role, sortKey, sortOrder) => {
        let filtered = employees;

        if (searchTerm) {
            filtered = filtered.filter(
                (employee) =>
                    employee.firstName.toLowerCase().includes(searchTerm) ||
                    employee.lastName.toLowerCase().includes(searchTerm) ||
                    employee.id.toString().includes(searchTerm)
            );
        }

        if (availability) {
            filtered = filtered.filter((employee) => employee.availability === availability);
        }

        if (role) {
            filtered = filtered.filter((employee) => employee.role === role);
        }

        if (sortKey) {
            filtered = [...filtered].sort((a, b) => {
                const orderMultiplier = sortOrder === "asc" ? 1 : -1;
                if (sortKey === "name") {
                    return orderMultiplier * a.firstName.localeCompare(b.firstName);
                }
                if (sortKey === "startDate") {
                    return orderMultiplier * (new Date(a.startDate) - new Date(b.startDate));
                }
                if (sortKey === "numFlights") {
                    return orderMultiplier * (a.numFlights - b.numFlights);
                }
                return 0;
            });
        }

        setFilteredEmployees(filtered);
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Employees</h1>

            <Row>
                {/* Filters Section */}
                <Col md={3} className="mb-4">
                    <h5>Filters</h5>
                    <Form.Group controlId="roleFilter" className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Select value={filterRole} onChange={handleRoleFilterChange}>
                            <option value="">All Roles</option>
                            <option value="Pilot">Pilot</option>
                            <option value="Flight Attendant">Flight Attendant</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="availabilityFilter" className="mb-3">
                        <Form.Label>Availability</Form.Label>
                        <Form.Select
                            value={availabilityFilter}
                            onChange={handleAvailabilityFilterChange}
                        >
                            <option value="">All Availability</option>
                            <option value="AVAILABLE">Available</option>
                            <option value="RESTING">Resting</option>
                            <option value="FLYING">Flying</option>
                        </Form.Select>
                    </Form.Group>
                    <h5>Sort</h5>
                    <Form.Group controlId="sortOptions" className="mb-3">
                        <Form.Label>Sort by</Form.Label>
                        <Form.Select value={sortKey} onChange={handleSortChange}>
                            <option value="">No Sorting</option>
                            <option value="name">Name</option>
                            <option value="startDate">Start Date</option>
                            <option value="numFlights">Number of Flights</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="sortOrder" className="mb-3">
                        <Form.Label>Sort Order</Form.Label>
                        <Form.Select value={sortOrder} onChange={handleSortOrderChange}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* Employee List Section */}
                <Col md={9}>
                <Row className="mb-3">
                    <Col md={8}>
                        <Form.Group controlId="searchBar" className="w-100">
                            <Form.Control
                                type="text"
                                placeholder="Search by Name or ID"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                style={{ height: "calc(1.5em + 0.75rem + 2px)" }} 
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4} className="d-flex align-items-center">
                        <Button variant="secondary" className="w-100" onClick={handleAddEmployee} style={{
                    marginTop: "0",
                    height: "calc(1.5em + 0.75rem + 2px)",
                    paddingTop: "7px",    
                }}>
                            Add Employee
                        </Button>
                    </Col>
                </Row>


                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : error ? (
                        <Alert variant="danger" className="text-center">
                            {error}
                        </Alert>
                    ) : (
                        <Table striped bordered hover>
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Start Date</th>
                                    <th>Role</th>
                                    <th>Number of Flights</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((employee) => (
                                    <tr key={employee.id} onClick={handleEmployee}>
                                        <td>{employee.id}</td>
                                        <td>
                                            {employee.firstName} {employee.lastName}
                                        </td>
                                        <td>
                                            {employee.startDate
                                                ? new Date(employee.startDate).toLocaleDateString()
                                                : "N/A"}
                                        </td>
                                        <td>{employee.role}</td>
                                        <td>{employee.numFlights}</td>
                                        <td>
                                            <span
                                                className={`badge ${
                                                    employee.availability === "AVAILABLE"
                                                        ? "bg-success"
                                                        : employee.availability === "RESTING"
                                                        ? "bg-warning"
                                                        : "bg-primary"
                                                }`}
                                            >
                                                {employee.availability}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default EmployeeList;
