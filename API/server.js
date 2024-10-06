const fs = require("fs");
const http = require("http"); // Using http instead of https for now
const express = require("express");
const bcrypt = require("bcrypt");
const helmet = require("helmet");
const cors = require("cors");
const payments = require("./routes/payments"); // Import the payments route
const app = express();

// Middleware
app.use(helmet()); // Secure HTTP headers
app.use(cors()); // Allow CORS for cross-origin requests
app.use(express.json()); // Parse JSON requests

// Temporary in-memory storage for users
let users = [];

// Register route
app.post("/api/auth/register", async (req, res) => {
    const { username, password } = req.body;

    // Check if the user already exists in memory
    const userExists = users.find((user) => user.username === username);
    if (userExists)
        return res.status(400).json({ message: "User already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save the new user in the array
    users.push({ username, password: hashedPassword });
    console.log(users);

    res.status(201).json({ message: "User registered successfully" });
});

// Login route
app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;

    // Find the user in memory
    const user = users.find((user) => user.username === username);
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    // Compare the password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful" });
});

app.post("/api/payment", async (req, res) => {
    const { amount, currency, provider, accountNumber, swiftCode } = req.body;

    // Basic validation
    if (!amount || !currency || !provider || !accountNumber || !swiftCode) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Validate that amount is a positive number
    if (amount <= 0) {
        return res.status(400).json({ message: "Amount must be a positive number." });
    }

    // Validate account number (should be numeric)
    if (!/^\d+$/.test(accountNumber)) {
        return res.status(400).json({ message: "Account number must be numeric." });
    }

    // Validate SWIFT code length
    if (!(swiftCode.length >= 8 && swiftCode.length <= 11)) {
        return res.status(400).json({ message: "SWIFT code must be between 8 and 11 characters." });
    }

    // Simulate storing the payment data (in a real application, this would involve a database)
    const transactionId = `TXN${Date.now()}`; // Generate a mock transaction ID
    const paymentData = {
        amount,
        currency,
        provider,
        accountNumber,
        swiftCode,
        transactionId,
    };

    // Log the payment data for debugging purposes
    console.log("Payment processed:", paymentData);

    // Respond with success message and transaction ID
    res.status(201).json({
        message: "Payment processed successfully.",
        transactionId,
    });
});
// Start the server using HTTP
const PORT = 5000; // You can use any available port
http.createServer(app).listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
});
