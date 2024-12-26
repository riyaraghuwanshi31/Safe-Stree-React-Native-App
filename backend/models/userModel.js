import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    _id: {type:String, required:true},
    name: { type: String, required: true },
    phone: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    emergencyContacts: [contactSchema], // Array of emergency contacts
});

export default mongoose.model('User', userSchema);
