import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const accountNumber = e.target.elements.accountNumber.value;
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;

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

      const data = await response.json();
      console.log("Login response data:", data); // Debugging output

      if (response.ok) {
        localStorage.setItem("accNo", accountNumber);
        localStorage.setItem("userType", data.userType); 
        setMessage("Login successful!");

        // Navigate based on userType
        if (data.userType === "Employee") {
          navigate("/EmployeeDashboard");
        } else {
          navigate("/UserDashboard");
        }
      } else {
        setMessage(`Login failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Login error:", error); // Logs the error for debugging
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" name="accountNumber" placeholder="ID" required />
        <input type="text" name="username" placeholder="Full Name" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
