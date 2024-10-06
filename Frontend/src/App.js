import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import "./App.css"; 
import Payments from "./Payment";
function NavBar() {
  const location = useLocation(); 
  return (
    <nav className="nav-bar">
      <ul>
       
        {location.pathname !== "/dashboard" && (location.pathname !== "/payments") && (
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
        <Link to="/payments">Payments</Link> {/* Add a link to payments */}
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
          <Route path="/payments" element={<Payments />} /> {/* Define the route for Payments */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
