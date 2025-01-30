import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import "../css/home.css";
import AuthConsumer from "../api_consumer/AuthConsumer";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.removeItem("user");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault(); 

    if (email && password) {
      try {
        const response = await AuthConsumer.login(email, password); 

        if (response) {
          localStorage.setItem("user", JSON.stringify(response)); 
          console.log("Login successful");
          setEmail("");
          setPassword("");
          
          setError(""); 
          // Redirect to the dashboard
          if (response.roles === "Admin") {
            navigate("/adminDashboard");
          }
          else {
            navigate("/staffDashboard");
          }
        } 
        else {
          setError("Invalid login. Make sure you insert the right credentials."); 
        }
      } 
      catch (error) {
        setError("An error occurred during login. Please try again."); 
        console.error("An error occurred during login:", error);
      }
    } 
    else {
      setError("Email or password cannot be empty"); 
    }
  };

  return (
    <div className="home-container">
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="p-4 shadow-lg home-card">
        <div className="text-center mb-4 logo-container">
          <img
              src="/media/Logo.png"
              alt="Flyquest Logo"
              className="logo"
          />
          <h2>Welcome Back!</h2>
      </div>

          {/* Show alert if there's an error */}
          {error && (
            <Alert variant="danger" onClose={() => setError("")} dismissible>
              {error}
            </Alert>
          )}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
            </Form.Group>

            <Button variant="dark" className="w-100" type="submit">
              Login
            </Button>
          </Form>
        </Card>
      </Container>
    </div>
  );
}

export default Home;
