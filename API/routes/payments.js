const express = require("express");
const Joi = require("joi"); // Import Joi for validation
const router = express.Router(); // Create a new router
const Payment = require('../models/payment'); // Import the Payment model

// Joi Schema for payment validation
const paymentSchema = Joi.object({
    amount: Joi.number().greater(0).required(), // Amount must be a positive number
    currency: Joi.string().valid('USD', 'EUR', 'ZAR').required(), // Adjust as necessary for your use case
    provider: Joi.string().min(2).max(50).required(), // Provider name
    accountNumber: Joi.string().min(8).max(20).required(), // Account number length can vary
    swiftCode: Joi.string().length(8).required() // SWIFT code should be of fixed length (8 or 11 characters)
});

// Payment Route
router.post("/payment", async (req, res) => {
    // Validate the request body against the Joi schema
    const { error } = paymentSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message); // Send validation error response

    const { amount, currency, provider, accountNumber, swiftCode } = req.body;

    // Create a new payment instance
    const payment = new Payment({ amount, currency, provider, accountNumber, swiftCode });

    try {
        await payment.save(); // Save the payment to the database
        res.status(201).send({
            message: "Payment successful",
            transactionId: payment.transactionId,
            amount,
            currency,
            accountNumber,
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).send("Payment processing failed. Please try again.");
    }
});

module.exports = router; // Ensure you're exporting the router
