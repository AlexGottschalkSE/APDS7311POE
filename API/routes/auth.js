const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");

// Joi schema for validation
const schema = Joi.object({
    username: Joi.string().min(3).max(30).alphanum().required(),
    id: Joi.string().required(), // Validate ID as a required string
    accountNumber: Joi.string().required(), // Validate Account Number as a required string
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

// Registration route
router.post("/register", async (req, res) => {
    // Validate the request body
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // Check if a user with the same username, id, or accountNumber already exists
        const userRef = db.collection('users');
        const userExistsQuery = await userRef.where('username', '==', req.body.username)
            .where('id', '==', req.body.id)
            .where('accountNumber', '==', req.body.accountNumber).get();

        if (!userExistsQuery.empty) {
            return res.status(400).send("User with the same username, ID, or account number already exists");
        }

        // Hash the password before saving the user
        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        // Create a new user in Firestore
        const userData = {
            username: req.body.username,
            id: req.body.id,
            accountNumber: req.body.accountNumber,
            password: hashedPassword,
        };

        // Save the user in Firestore
        await db.collection('users').doc(req.body.id).set(userData);

        res.send("User registered successfully");
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Error registering user");
    }
});

module.exports = router;


router.post("/login", async (req, res) => {
    const { username, accountNumber, password } = req.body;

    // Validate that both username, accountNumber, and password are provided
    if (!username || !accountNumber || !password) {
        return res.status(400).send("Username, account number, and password are required");
    }

    try {
        // Find the user by username and account number
        const userRef = db.collection('users');
        const userQuery = await userRef.where('username', '==', username)
            .where('accountNumber', '==', accountNumber).get();

        if (userQuery.empty) {
            return res.status(400).send("Invalid username, account number, or password");
        }

        const userDoc = userQuery.docs[0]; // Get the first matching user
        const user = userDoc.data();

        // Compare the password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send("Invalid username, account number, or password");
        }

        res.send("Login successful");
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).send("Error logging in");
    }
});

module.exports = router;
