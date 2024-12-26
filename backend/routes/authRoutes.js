import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const router = express.Router();
const SECRET_KEY = 'your_jwt_secret_key';
const TOKEN_EXPIRATION = '12h';

// Sign Up
router.post('/signup', async (req, res) => {
    try {
        const { name, phone, email, age, address, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            phone,
            email,
            age,
            address,
            password: hashedPassword,
        });

        await newUser.save();
        const token = jwt.sign({ userId: newUser._id }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });

        res.status(201).json({ message: 'User created successfully', token });
    } catch (error) {
        res.status(500).json({ error: 'Signup failed. Email may already be in use.' });
    }
});
    


// Log in
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        console.log(`user ${user}`);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Ensure password matches
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password: ${isMatch}`);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
        res.cookie('authToken', token, { httpOnly: true });
        res.json({ message: 'Login successful', token, userId: user._id });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});



// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('authToken');
    res.json({ message: 'Logout successful' });
});

export default router;