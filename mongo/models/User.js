import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, 
    role: { type: String, enum: ['normal', 'premium', 'admin'], default: 'normal' }
});

export default mongoose.model('User', UserSchema);
