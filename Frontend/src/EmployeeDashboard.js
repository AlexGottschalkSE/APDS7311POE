import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";  
import { ThemeContext } from './ThemeContext';

function EmployeeDashboard() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    const accountNumber = localStorage.getItem("accNo");
    const userType = localStorage.getItem("userType");
    if (!accountNumber || userType !== "Employee") {
      navigate("/login");  
    }
  }, [navigate]); 

  return (
    <div>
      <h2>Welcome to the Employee Dashboard</h2>
      <button onClick={toggleTheme}>
        Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  );
}

export default EmployeeDashboard;
