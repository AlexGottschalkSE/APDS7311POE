const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../models/User");


const schema = Joi.object({
  username: Joi.string().min(3).max(30).alphanum().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

router.post("/register", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const userExists = await User.findOne({ username: req.body.username });
  if (userExists) return res.status(400).send("User already exists");

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const user = new User({
    username: req.body.username,
    password: hashedPassword,
  });

  await user.save();
  res.send("User registered successfully");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).send("Invalid username or password");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).send("Invalid username or password");

  res.send("Login successful");
});

module.exports = router;
