import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home.jsx'
import AllFlightsPage from './pages/AllFlightsPage.jsx';
import EmployeeFlightsPage from './pages/EmployeeFlightsPage.jsx';
import Employees from './pages/Employees.jsx';
import AddEmployee from './pages/AddEmployee.jsx';
import EmployeePage from './pages/EmployeePage.jsx';
import AdminEmployeePage from './pages/AdminEmployeePage.jsx';
import Notifications from './pages/Notifications.jsx';
import AddFlight from './pages/AddFlight.jsx';
import AllPlanesPage from './pages/AllPlanesPage.jsx';
import FlightManagement from './pages/FlightManagement.jsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" Component={Home} />
                <Route path="/adminDashboard" Component={AllFlightsPage} />
                <Route path="/staffDashboard" Component={EmployeeFlightsPage} />
                <Route path="/employeesList" Component={Employees} />   
                <Route path="/addEmployee" Component={AddEmployee} />
                <Route path="/employeeAccount" Component={EmployeePage} />
                <Route path="/employeeInfo" Component={AdminEmployeePage} />
                <Route path="/notifications" Component={Notifications} />
                <Route path="/addFlight" Component={AddFlight} />
                <Route path="/allPlanes" Component={AllPlanesPage} />
                <Route path="/flightManagement" Component={FlightManagement} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;