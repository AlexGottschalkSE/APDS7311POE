import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "./History.css"; 

const Approve = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); 
  const [message, setMessage] = useState("");
  const accountNumber = localStorage.getItem("accNo");
  const userType = localStorage.getItem("userType");
  const updatePaymentStatus = async (transactionId, approved) => {
    try {
      await fetch(`https://localhost:443/api/approve/${transactionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ approved }),
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };
  useEffect(() => {

    if (!accountNumber) {
      setMessage("Redirecting to login...");
      navigate("/login");  
    }
    if (userType != "Employee") {
        setMessage("Redirecting to login...");
        navigate("/login");  
      }
    if (accountNumber) {
      axios
        .get(`https://localhost:443/api/payments`)
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
      setError("Payments not found.");
      setLoading(false);
    }
  }, [accountNumber]);

  return (
    <div>
      <h1>Approve Payments</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <table border="1" cellPadding="10" cellSpacing="0">
            <thead>
              <tr>
                <th>Account Number</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Provider</th>
                <th>SWIFT Code</th>
                <th>Approved?</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <tr key={transaction.transactionId}>
                    <td>{transaction.accountNumber}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.currency}</td>
                    <td>{transaction.provider}</td>
                    <td>{transaction.swiftCode}</td>
                    <td>{transaction.approved ? "Yes" : "No"}</td>
                    <td>
                    {!transaction.approved && (
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to approve this payment?")) {
                            const updatedTransactions = [...transactions];
                            updatedTransactions[index].approved = true;
                            setTransactions(updatedTransactions);
                            updatePaymentStatus(transaction.transactionId, true);
                          }
                        }}
                      >
                        Approve Payment
                      </button>
                    )}
                  </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}  

export default Approve;