const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Joi Schema for validation
const schema = Joi.object({
  username: Joi.string().min(3).max(30).alphanum().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

// Register Route
router.post("/register", async (req, res) => {
  // Validate the request body with Joi
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the user already exists
  const userExists = await User.findOne({ username: req.body.username });
  if (userExists) return res.status(400).send("User already exists");

  // Hash the password before saving it
  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  // Create the new user and save to the database
  const user = new User({
    username: req.body.username,
    password: hashedPassword,
  });

  await user.save();
  res.send("User registered successfully");
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Find the user in the database
  const user = await User.findOne({ username });
  if (!user) return res.status(400).send("Invalid username or password");

  // Compare the password with the stored hashed password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).send("Invalid username or password");

  res.send("Login successful");
});

module.exports = router;
