import React, { useState } from "react";
import "./Payments.css"; 

function Payments() {
  const [message, setMessage] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();

    const amount = parseFloat(e.target[0].value);
    const currency = e.target[1].value;
    const provider = e.target[2].value;
    const swiftCode = e.target[3].value;

    const accountNumber = localStorage.getItem('accNo');

    if (!accountNumber) {
      setMessage("Account number not found in localStorage.");
      return;
    }

    if (amount <= 0) {
      setMessage("Amount must be a positive number.");
      return;
    }

    if (!/^\d+$/.test(accountNumber)) {
      setMessage("Account number must be numeric.");
      return;
    }

    if (!(swiftCode.length >= 8 && swiftCode.length <= 11)) {
      setMessage("SWIFT code must be between 8 and 11 characters.");
      return;
    }

    const paymentData = {
      amount, 
      currency,
      provider,
      swiftCode,
    };

    try {
      const response = await fetch("https://localhost:443/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "account-number": accountNumber, 
        },
        body: JSON.stringify(paymentData),
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessage(`Payment successful! Transaction ID: ${data.transactionId}`);
      } else {
        setMessage(`Payment failed: ${data.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      console.error("Fetch Error:", error); 
    }
  };

  return (
    <div className="card">
      <h2>Make a Payment</h2>
      <form onSubmit={handlePayment}>
        <input type="number" placeholder="Amount" required />
        <select name="currency" required>
          <option value="ZAR">ZAR</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
        <input type="text" placeholder="Payment Provider" value="SWIFT" readOnly />
        <input type="text" placeholder="Beneficiary SWIFT Code" required />
        <button type="submit">Submit Payment</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Payments;
