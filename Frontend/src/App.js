import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation, Navigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import History from "./History";
import EmployeeDashboard from "./EmployeeDashboard";
import UserDashboard from "./UserDashboard";
import Payments from "./Payment";
import ApprovePayment from "./ApprovePayments";
import "./App.css"; 

function NavBar() {
  const location = useLocation();
  const userType = localStorage.getItem("userType"); // Retrieve userType from localStorage
  console.log("User Type: ", userType);
  return (
    <nav className="nav-bar">
      <ul>
        {/* Conditional Rendering for Register and Login Links */}
        {userType !== "User" && location.pathname !== "/dashboard" && location.pathname !== "/payments" && location.pathname !== "/history" && (
          <>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
        
        {/* Common Links */}
        {location.pathname !== "/login" && location.pathname !== "/register" && (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/payments">Payments</Link> 
            </li>
            <li>
              <Link to="/history">History</Link> 
            </li>

            {/* Conditionally Render Approve Payments Link for Employees */}
            {userType === "Employee" && (
              <li>
                <Link to="/approve">Approve Payments</Link> 
              </li>
            )}
          </>
        )}
      </ul>
    </nav>
  );
}

function ProtectedRoute({ children, allowedUserType }) {
  const userType = localStorage.getItem("userType");

  // Redirect if userType does not match allowedUserType
  if (userType !== allowedUserType) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavBar /> 
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<ProtectedRoute allowedUserType="Employee"><Register /></ProtectedRoute>} />
          <Route path="/login" element={<ProtectedRoute allowedUserType="Employee"><Login /></ProtectedRoute>} />

          {/* Common Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/history" element={<History />} />
          <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />
          <Route path="/UserDashboard" element={<UserDashboard />} />

          {/* Protected Route for Approve Payments (Only for Employees) */}
          <Route path="/approve" element={<ProtectedRoute allowedUserType="Employee"><ApprovePayment /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
