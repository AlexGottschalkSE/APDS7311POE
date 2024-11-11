import React, { useState, useEffect }  from "react";
import { useNavigate } from "react-router-dom";  


function UserDashboard() {
  const [setMessage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const accountNumber = localStorage.getItem("accNo");
     
    if (!accountNumber) {
      setMessage("Redirecting to login...");
      navigate("/login");  
    }
  }, [navigate]); 
  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
    </div>
  );
}

export default UserDashboard;
