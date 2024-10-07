import React, { useEffect, useState } from "react";
import "./History.css"; 

const History = () => {
    const [transactions, setTransactions] = useState([]);
  
    // Fetch data when component loads (replace the API URL with your actual endpoint)
    // useEffect(() => {
    //   axios.get("/api/transactions") // Change this to your API endpoint
    //     .then((response) => {
    //       setTransactions(response.data); // Assuming the response contains an array of transactions
    //     })
    //     .catch((error) => {
    //       console.error("Error fetching data:", error);
    //     });
    // }, []);
  
    return (
      <div>
        <h1>Transaction History</h1>
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Currency</th>
              <th>Provider</th>
              <th>Account Number</th>
              <th>SWIFT Code</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction._id}> {/* Assuming each transaction has a unique _id */}
                  <td>{transaction.amount}</td>
                  <td>{transaction.currency}</td>
                  <td>{transaction.provider}</td>
                  <td>{transaction.accountNumber}</td>
                  <td>{transaction.swiftCode}</td>
                  <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

export default History