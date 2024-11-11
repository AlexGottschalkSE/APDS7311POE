import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import History from "./History";
import PropTypes from "prop-types"; 
import EmployeeDashboard from "./EmployeeDashboard";
import UserDashboard from "./UserDashboard";
import Payments from "./Payment";
import ApprovePayment from "./ApprovePayments";
import "./App.css"; 
import { ThemeProvider } from "./ThemeContext";

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType"); 

  const handleLogout = () => {
    localStorage.removeItem("accNo");
    localStorage.removeItem("userType"); 
    navigate("/login"); 
  };

  return (
    <ThemeProvider>
    <nav className="nav-bar">
      <ul>
        {/* Show Login link only if userType is null (user not logged in) */}
        {!userType && (
          <>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
          <Link to="/register">Create An Account</Link>
          </li>
          </>
        )}
        
        {/* Common Links for all logged-in users */}
        {userType && location.pathname !== "/login" && location.pathname !== "/register" && (
          <>
          {userType === "User" &&(
            <>
              <li>
              <Link to="/UserDashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/payments">Payments</Link> 
            </li>
            <li>
              <Link to="/history">History</Link> 
            </li>
            </>
          )}
            {/* Conditionally Render Approve Payments Link for Employees */}
            {userType === "Employee" && (
              <>
                <li>
                  <Link to="/EmployeeDashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/approve">Approve Payments</Link>
                </li>
              </>
            )}
            
            {/* Accessible Logout Button */}
            <li>
              <button 
                onClick={handleLogout} 
                style={{ 
                  cursor: 'pointer', 
                  textDecoration: 'underline', 
                  color: 'blue', 
                  background: 'none', 
                  border: 'none', 
                  padding: 0, 
                  font: 'inherit' 
                }}
                aria-label="Logout"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
    </ThemeProvider>
  );
}

function ProtectedRoute({ children, allowedUserType }) {
  const userType = localStorage.getItem("userType");

  if (!userType && allowedUserType) {
    return <Navigate to="/login" replace />;
  }

  if (allowedUserType && userType !== allowedUserType) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,      
  allowedUserType: PropTypes.string         
};

function App() {
  return (
    <Router>
      <ThemeProvider>
      <div className="app-container">
        <NavBar /> 
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

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
      </ThemeProvider>
    </Router>
  );
}

export default App;
