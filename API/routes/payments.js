const express = require("express");
const Joi = require("joi");
const router = express.Router();
const Payment = require("../models/Payment");

const paymentSchema = Joi.object({
    amount: Joi.number().greater(0).required(),
    currency: Joi.string().valid("USD", "EUR", "ZAR").required(),
    provider: Joi.string().min(2).max(50).required(),
    accountNumber: Joi.string().min(8).max(20).required(), 
    swiftCode: Joi.string().length(8).required(),
});


router.post("/payment", async (req, res) => {
    const { error } = paymentSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    const payerAccountNumber = req.headers['account-number'];

    if (!payerAccountNumber) {
        return res.status(400).send("Payer's account number is required in headers.");
    }

    const { amount, currency, provider, accountNumber, swiftCode } = req.body;

    const payment = new Payment({
        payerAccountNumber,   
        beneficiaryAccountNumber: accountNumber,  
        amount,
        currency,
        provider,
        swiftCode,
    });

    const transactionId = generateTransactionId();

    try {
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

const generateTransactionId = () => {
    return Math.random().toString(36).substring(2, 15);
};

router.get("/payments/:accountNumber", async (req, res) => {
    const { accountNumber } = req.params;

    try {
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

router.get("/payments", async (req, res) => {
    try {
        const payments = await Payment.find();

        if (payments.length === 0) {
            return res.status(404).send("No payments found.");
        }

        res.status(200).send(payments);
    } catch (error) {
        console.error("Error retrieving payments:", error);
        res.status(500).send("Failed to retrieve payments. Please try again.");
    }
});

module.exports = router;