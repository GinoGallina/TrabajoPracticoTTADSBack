import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    default: () => crypto.randomUUID(),
    unique: true,
  },
  username: { type: String, required: true },  // Corrected 'require' to 'required'
  email: { type: String, required: true },    // Corrected 'require' to 'required'
  type: { type: String, required: true },     // Corrected 'require' to 'required'
  password: { type: String, required: true }, // Corrected 'require' to 'required'
  address: { type: String, required: true }   // Corrected 'require' to 'required'
});

const User = mongoose.model('User', userSchema);

export default User;