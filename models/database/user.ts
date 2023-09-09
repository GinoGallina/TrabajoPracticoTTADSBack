import mongoose, { Document, Schema, Model } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import crypto from 'crypto';

interface IUserDocument extends IUser, Document {}

const userSchema: Schema<IUserDocument> = new Schema({
  userId: {
    type: String,
    default: () => crypto.randomUUID(),
    unique: true,
  },
  username: { type: String, required: true, unique: true, uniqueCaseInsensitive: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
  },
  type: { type: String, required: true },
  password: { type: String, required: true, trim: true },
  address: { type: String, required: true },
  state: { type: String, default: 'Active' },
},
{
  timestamps: true,
});

userSchema.plugin(mongooseUniqueValidator);

const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', userSchema);

export default User;