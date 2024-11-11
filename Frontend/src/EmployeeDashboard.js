import React, { useState, useEffect }  from "react";
import { useNavigate } from "react-router-dom";  


function EmployeeDashboard() {
  const [setMessage] = useState("");
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
    </div>
  );
}

export default EmployeeDashboard;
