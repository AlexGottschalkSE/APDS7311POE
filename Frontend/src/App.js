import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import History from "./History"
import "./App.css"; 
import Payments from "./Payment";
import ApprovePayment from "./ApprovePayments";
function NavBar() {
  const location = useLocation(); 
  return (
    <nav className="nav-bar">
      <ul>
       
        {location.pathname !== "/dashboard" && (location.pathname !== "/payments") && (location.pathname !== "/history") && (
          <>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
        {(location.pathname !== "/login") && (location.pathname !== "/register") && (
        <><li>
          <Link to="/dashboard">Dashboard</Link>
          
        </li>
        <li>
        <Link to="/payments">Payments</Link> 
      </li>
      <li>
        <Link to="/history">History</Link> 
      </li>
      <li>
        <Link to="/approve">Approve Payments</Link> 
      </li>
      </>
      
        )}
      </ul>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavBar /> 
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payments" element={<Payments />} /> 
          <Route path="/history" element={<History />}/>
          <Route path="/approve" element={<ApprovePayment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
