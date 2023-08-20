import mongoose from 'mongoose'
import crypto from 'crypto'

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    default: () => crypto.randomUUID(),
    unique: true
  },
  username: { type: String, required: true },
  email: { type: String, required: true },
  type: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true }
})

const User = mongoose.model('User', userSchema)

export default User
