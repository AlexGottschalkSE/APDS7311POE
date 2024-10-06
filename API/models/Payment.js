const mongoose = require("mongoose");

// Define the payment schema
const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  provider: { type: String, required: true },
  accountNumber: { type: String, required: true },
  swiftCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create the Payment model
const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
