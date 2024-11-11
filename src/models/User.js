// dvsnote/src/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }  // 'manager' or 'customer'
});


export default mongoose.models.User || mongoose.model('User', UserSchema);
