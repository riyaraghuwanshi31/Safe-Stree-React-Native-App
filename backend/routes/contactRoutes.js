import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/userModel.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();


// add contacts
router.post('/contacts', authMiddleware, async (req, res) => {
    try {
        console.log(req.body); // Check the body content

        const { name, phone } = req.body;
        const user = await User.findById(req.userId);

        console.log(user);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.emergencyContacts.length >= 3) {
            return res.status(400).json({ error: 'You can only add up to 3 contacts' });
        }

        const newContact = { _id: uuidv4(), name, phone }; // Add _id
        user.emergencyContacts.push(newContact);
        await user.save();
        res.json({ message: 'Emergency contact added successfully', contacts: user.emergencyContacts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add contact' });
    }
});


// fetch contacts
router.get('/contacts', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user.emergencyContacts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});


// delete contact
router.delete('/contacts/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const contactId = req.params.id;

        // Find the contact to delete
        const contactIndex = user.emergencyContacts.findIndex(
            (contact) => contact._id === contactId
        );

        if (contactIndex === -1) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        // Remove the contact from the array
        user.emergencyContacts.splice(contactIndex, 1);
        await user.save();

        res.json({
            message: 'Emergency contact deleted successfully',
            contacts: user.emergencyContacts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});




export default router;