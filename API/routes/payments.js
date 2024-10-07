const express = require("express");
const Joi = require("joi");
const router = express.Router();
const Payment = require("../models/payment");

// Updated Joi validation schema (for the beneficiary's account number)
const paymentSchema = Joi.object({
    amount: Joi.number().greater(0).required(),
    currency: Joi.string().valid("USD", "EUR", "ZAR").required(),
    provider: Joi.string().min(2).max(50).required(),
    accountNumber: Joi.string().min(8).max(20).required(),  // Beneficiary's account number
    swiftCode: Joi.string().length(8).required(),
});

// POST /payment route (making a payment)
router.post("/payment", async (req, res) => {
    // Validate the payment data (for the beneficiary)
    const { error } = paymentSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Extract the payer's account number from request headers
    const payerAccountNumber = req.headers['account-number'];

    // Check if payer's account number is provided in the headers
    if (!payerAccountNumber) {
        return res.status(400).send("Payer's account number is required in headers.");
    }

    const { amount, currency, provider, accountNumber, swiftCode } = req.body;

    // Create a new payment document
    const payment = new Payment({
        payerAccountNumber,   // The account number of the person making the payment
        beneficiaryAccountNumber: accountNumber,  // The account number of the beneficiary
        amount,
        currency,
        provider,
        swiftCode,
    });

    // Generate a transaction ID
    const transactionId = generateTransactionId();

    try {
        // Save the payment to the database
        await payment.save();

        res.status(201).send({
            message: "Payment successful",
            transactionId: transactionId,
            amount,
            currency,
            payerAccountNumber,
            beneficiaryAccountNumber: accountNumber,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Payment processing failed. Please try again.");
    }
});

// Helper function to generate a transaction ID
const generateTransactionId = () => {
    return Math.random().toString(36).substring(2, 15);
};

router.get("/payments/:accountNumber", async (req, res) => {
    const { accountNumber } = req.params;

    try {
        // Find all payments made by the user with the given account number
        const payments = await Payment.find({ payerAccountNumber: accountNumber });

        if (payments.length === 0) {
            return res.status(404).send("No payments found for the given account number.");
        }

        res.status(200).send(payments);
    } catch (error) {
        console.error("Error retrieving payments:", error);
        res.status(500).send("Failed to retrieve payments. Please try again.");
    }
});

module.exports = router;