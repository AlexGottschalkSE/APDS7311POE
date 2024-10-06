import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "./Register.css"; // Import CSS for styling

function Register() {
  const [captchaVerified, setCaptchaVerified] = useState(false);

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
    const password = e.target[1].value;

    const userData = {
      username,
      password,
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration Successful!");
      } else {
        alert("Registration Failed: " + data.message);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="card">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <ReCAPTCHA
          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Replace with your Google ReCaptcha site key
          onChange={handleCaptchaChange}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
