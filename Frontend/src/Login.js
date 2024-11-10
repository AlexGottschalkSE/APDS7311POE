import React, { useState } from "react";
import { json, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const accountNumber = e.target[0].value;          
    const username = e.target[1].value;    
    const password = e.target[2].value;    

    const userData = {
      accountNumber,
      username,
      password,
    };

    try {
      const response = await fetch("https://localhost:443/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      console.log(JSON.stringify(userData));
      const data = await response.json();
      console.log("Login response data:", data); // Check the full structure of data

      if (response.ok) {
        localStorage.setItem("accNo", accountNumber);
        localStorage.setItem("userType", data.userType); // Store userType
        setMessage("Login successful!");

        // Navigate to the appropriate dashboard based on userType
        if (data.userType === "Employee") {
          navigate("/EmployeeDashboard");
        } else {
          navigate("/UserDashboard");
        }
      } else {
        setMessage(`Login failed: ${data.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="ID" required /> 
        <input type="text" placeholder="Full Name" required /> 
        <input type="password" placeholder="Password" required /> 
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
