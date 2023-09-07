import mongoose, { Schema } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import crypto from 'crypto';
const userSchema = new Schema({
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
}, {
    timestamps: true,
});
userSchema.plugin(mongooseUniqueValidator);
const User = mongoose.model('User', userSchema);
export default User;
//# sourceMappingURL=user.js.map