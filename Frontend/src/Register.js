import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "./Register.css";

function Register() {
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(()=> {
    localStorage.removeItem("accNo");
    localStorage.removeItem("userType");
  })

  const handleCaptchaChange = (value) => {
    setCaptchaVerified(true);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!captchaVerified) {
      alert("Please verify the captcha.");
      return;
    }

    const username = e.target[0].value;
    const id = e.target[1].value;
    const accountNumber = e.target[2].value;
    const password = e.target[3].value;
    const userType = "User"; // Get userType from the dropdown

    const userData = {
      username,
      id,
      accountNumber,
      password,
      userType, 
    };

    try {
      const response = await fetch("https://localhost:443/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Account creation successful!");

        // Optionally redirect back to the dashboard or another page
        navigate("/EmployeeDashboard");
      } else {
        alert("Account creation failed: " + data.message);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="card">
      <h2>Create an Account</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Full Name" required />
        <input type="text" placeholder="ID" required />
        <input type="text" placeholder="Account Number" required />
        <input type="password" placeholder="Password" required />
        
        
        <ReCAPTCHA
          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
          onChange={handleCaptchaChange}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
