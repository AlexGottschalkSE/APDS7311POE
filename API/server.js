const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const admin = require("firebase-admin");
const serviceAccountKeyPath =
  "./apds-c658e-firebase-adminsdk-6jvhj-f7159291d6.json";
const serviceAccountKey = fs.readFileSync(serviceAccountKeyPath, "utf8");
const serviceAccount = JSON.parse(serviceAccountKey);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://apds-c658e-default-rtdb.europe-west1.firebasedatabase.app",
});

app.use(helmet());
app.use(cors());
app.use(express.json());

const db = admin.firestore();

app.post("/api/auth/register", async (req, res) => {
  const { username, id, accountNumber, password } = req.body;

  if (!username || !id || !accountNumber || !password) {
    return res.status(400).json({
      message: "Full Name, ID, Account Number, and Password are required",
    });
  }

  try {
    const userRef = db.collection("users").doc(id);
    const doc = await userRef.get();

    if (doc.exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = {
      username,
      id,
      accountNumber,
      password: hashedPassword,
    };

    await userRef.set(newUser);
    console.log(`User ${username} registered successfully`);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { accountNumber, username, password } = req.body;

  if (!accountNumber || !username || !password) {
    return res.status(400).json({
      message: "Account Number, Username, and Password are required.",
    });
  }

  try {
    const usersRef = db.collection("users");
    const userSnapshot = await usersRef
      .where("accountNumber", "==", accountNumber)
      .where("username", "==", username)
      .get();

    console.log("User snapshot:", userSnapshot.docs);

    if (userSnapshot.empty) {
      return res
        .status(400)
        .json({ message: "Invalid credentials. User not found." });
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Invalid credentials. Incorrect password." });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Error logging in" });
  }
});

app.post("/api/payment", async (req, res) => {
    const { amount, currency, provider, swiftCode } = req.body;
    const {approved} = false;
    const accountNumber = req.headers['account-number'];  

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

  try {
    const usersRef = db.collection("users");
    const userSnapshot = await usersRef
      .where("accountNumber", "==", accountNumber)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).json({ message: "User not found." });
    }

    const userDoc = userSnapshot.docs[0].ref;

    const paymentRef = userDoc.collection("payments").doc(transactionId);
    await paymentRef.set(paymentData);

    console.log(
      `Payment for accountNumber ${accountNumber} processed:`,
      paymentData
    );

    res.status(201).json({
      message: "Payment processed successfully.",
      transactionId,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ message: "Error processing payment" });
  }
});

app.get("/api/payments/:accountNumber", async (req, res) => {
  const { accountNumber } = req.params;

  try {
    const userRef = db.collection("users").doc(accountNumber);
    const paymentsSnapshot = await userRef.collection("payments").get();

    if (paymentsSnapshot.empty) {
      return res
        .status(404)
        .json({ message: "No payments found for this account." });
    }

    const payments = paymentsSnapshot.docs.map((doc) => doc.data());
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving payments" });
  }
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
