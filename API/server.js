const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");
const bcrypt = require("bcrypt");
const helmet = require("helmet");
const cors = require("cors");
const payments = require("./routes/payments");
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

let users = [];

app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const userExists = users.find((user) => user.username === username);
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    users.push({ username, password: hashedPassword });
    console.log(users);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error registering user" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  try {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error logging in" });
  }
});

app.post("/api/payment", async (req, res) => {
  const { amount, currency, provider, accountNumber, swiftCode } = req.body;

  if (!amount || !currency || !provider || !accountNumber || !swiftCode) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (amount <= 0) {
    return res
      .status(400)
      .json({ message: "Amount must be a positive number." });
  }

  if (!/^\d+$/.test(accountNumber)) {
    return res.status(400).json({ message: "Account number must be numeric." });
  }

  if (!(swiftCode.length >= 8 && swiftCode.length <= 11)) {
    return res
      .status(400)
      .json({ message: "SWIFT code must be between 8 and 11 characters." });
  }

  const transactionId = `TXN${Date.now()}`;
  const paymentData = {
    amount,
    currency,
    provider,
    accountNumber,
    swiftCode,
    transactionId,
  };

  console.log("Payment processed:", paymentData);

  res.status(201).json({
    message: "Payment processed successfully.",
    transactionId,
  });
});

const privateKey = fs.readFileSync("./server.key", "utf8");
const certificate = fs.readFileSync("./server.crt", "utf8");

const credentials = { key: privateKey, cert: certificate };

https.createServer(credentials, app).listen(443, () => {
  console.log("HTTPS Server running on port 443");
});

app.use((req, res, next) => {
  if (req.secure) {
    return next();
  }
  res.redirect(`https://${req.headers.host}${req.url}`);
});

http.createServer(app).listen(180, () => {
  console.log("HTTP Server running on port 80, redirecting to HTTPS");
});
