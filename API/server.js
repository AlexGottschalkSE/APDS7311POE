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

// Payments route
app.use("/api", payments); // Register the payments route under the /api path

// Start the server using HTTP
const PORT = 5000; // You can use any available port
http.createServer(app).listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
});
