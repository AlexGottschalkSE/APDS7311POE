import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "./History.css"; 

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); 
  const [message, setMessage] = useState("");
  const accountNumber = localStorage.getItem("id");
  const userType = localStorage.getItem("userType");

  useEffect(() => {

    if (!accountNumber) {
      setMessage("Redirecting to login...");
      navigate("/login");  
    }
    if (userType != "User") {
      setMessage("Redirecting to login...");
      navigate("/login");  
    }
    if (accountNumber) {
      axios
        .get(`https://localhost:443/api/payments/${accountNumber}`)
        .then((response) => {
          setTransactions(response.data); 
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching transactions:", error);
          setError("Error fetching transactions.");
          setLoading(false);
        });
    } else {
      setError("Account number not found.");
      setLoading(false);
    }
  }, [accountNumber]);

  return (
    <div>
      <h1>Transaction History</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Currency</th>
              <th>Provider</th>
              <th>SWIFT Code</th>
              <th>Approved?</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction.transactionId}>
                  <td>{transaction.amount}</td>
                  <td>{transaction.currency}</td>
                  <td>{transaction.provider}</td>
                  <td>{transaction.swiftCode}</td>
                  <td>{transaction.approved ? "Yes" : "No"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default History;