const mongoose = require('mongoose');

// Define the payment schema
const paymentSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    provider: { type: String, required: true },
    accountNumber: { type: String, required: true },
    swiftCode: { type: String, required: true },
    transactionId: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

// Generate a unique transaction ID before saving the payment
paymentSchema.pre('save', function (next) {
    if (!this.transactionId) {
        this.transactionId = Math.random().toString(36).substr(2, 9); // Simple transaction ID generation
    }
    next();
});

// Create the Payment model
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
