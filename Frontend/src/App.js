import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import "./App.css"; 

function NavBar() {
  const location = useLocation(); 
  return (
    <nav className="nav-bar">
      <ul>
       
        {location.pathname !== "/dashboard" && (
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
        <li>
          <Link to="/dashboard">Dashboard</Link>
          
        </li>
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
