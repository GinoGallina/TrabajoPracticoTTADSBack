import mongoose, { Document, Schema, Model } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { commonSchemaFields } from './schemas/userCommonSchemaFields.js';

interface IUserDocument extends IUser, Document {}

const userSchema: Schema<IUserDocument> = new Schema(commonSchemaFields, {
  timestamps: true,
});
userSchema.plugin(mongooseUniqueValidator);

const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', userSchema);

export default User;