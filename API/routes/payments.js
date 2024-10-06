const express = require("express");
const Joi = require("joi");
const router = express.Router();
const Payment = require("../models/payment"); // Import your Payment model

// Joi Schema for payment validation
const paymentSchema = Joi.object({
  amount: Joi.number().greater(0).required(), // Positive number for amount
  currency: Joi.string().valid("USD", "EUR", "ZAR").required(), // Currencies allowed
  provider: Joi.string().min(2).max(50).required(), // Provider validation
  accountNumber: Joi.string().min(8).max(20).required(), // Account number validation
  swiftCode: Joi.string().length(8).required(), // SWIFT code length fixed
});

// Payment Route
router.post("/payment", async (req, res) => {
  const { error } = paymentSchema.validate(req.body); // Validate request body
  if (error) return res.status(400).send(error.details[0].message); // Return validation error

  const { amount, currency, provider, accountNumber, swiftCode } = req.body;

  // Create a new payment instance
  const payment = new Payment({
    accountNumber,
    amount,
    currency,
    provider,
    swiftCode,
  });
  const transactionId = generateTransactionId(); // Generate a transaction ID
  try {
    await payment.save(); // Save the payment to the database
    res.status(201).send({
      message: "Payment successful",
      transactionId: transactionId, // Assuming payment model creates a transaction ID
      amount,
      currency,
      accountNumber,
    });
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).send("Payment processing failed. Please try again.");
  }
});

const generateTransactionId = () => {
  return Math.random().toString(36).substring(2, 15); // Generate a random string
};

module.exports = router; // Export the router
