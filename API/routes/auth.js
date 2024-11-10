const express = require("express");
const router = express.Router();
const Joi = require("joi");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");

const schema = Joi.object({
  username: Joi.string().min(3).max(30).alphanum().required(),
  id: Joi.string().required(),
  accountNumber: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Please try again later.",
});

router.post("/register", loginLimiter, async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const userRef = db.collection("users");
    const userExistsQuery = await userRef
      .where("username", "==", req.body.username)
      .where("id", "==", req.body.id)
      .where("accountNumber", "==", req.body.accountNumber)
      .get();

    if (!userExistsQuery.empty) {
      return res
        .status(400)
        .send(
          "User with the same username, ID, or account number already exists"
        );
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const userData = {
      username: req.body.username,
      id: req.body.id,
      accountNumber: req.body.accountNumber,
      password: hashedPassword,
    };

    await db.collection("users").doc(req.body.id).set(userData);

    res.send("User registered successfully");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Error registering user");
  }
});

module.exports = router;

router.post("/login", loginLimiter, async (req, res) => {
  const { username, accountNumber, password } = req.body;

  if (!username || !accountNumber || !password) {
    return res
      .status(400)
      .send("Username, account number, and password are required");
  }

  try {
    const userRef = db.collection("users");
    const userQuery = await userRef
      .where("username", "==", username)
      .where("accountNumber", "==", accountNumber)
      .get();

    if (userQuery.empty) {
      return res
        .status(400)
        .send("Invalid username, account number, or password");
    }

    const userDoc = userQuery.docs[0];
    const user = userDoc.data();

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(400)
        .send("Invalid username, account number, or password");
    }

    res.send("Login successful");
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).send("Error logging in");
  }
});

module.exports = router;
