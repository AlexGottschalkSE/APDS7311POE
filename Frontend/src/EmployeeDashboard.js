import React, { useContext, useState, useEffect }  from "react";
import { useNavigate } from "react-router-dom";  
import { ThemeContext } from './ThemeContext';

function EmployeeDashboard() {
  const [setMessage] = useState("");
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  useEffect(() => {
    const accountNumber = localStorage.getItem("accNo");
    const userType = localStorage.getItem("userType");
    if (!accountNumber) {
      navigate("/login");  
    }
    if (userType !="Employee") {
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
