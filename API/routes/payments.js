const express = require("express");
const Joi = require("joi");
const router = express.Router();
const Payment = require("../models/payment"); 

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

  const { amount, currency, provider, accountNumber, swiftCode } = req.body;

 
  const payment = new Payment({
    accountNumber,
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
      accountNumber,
    });
  } catch (err) {
    console.error(err); 
    res.status(500).send("Payment processing failed. Please try again.");
  }
});

const generateTransactionId = () => {
  return Math.random().toString(36).substring(2, 15);
};

module.exports = router;
