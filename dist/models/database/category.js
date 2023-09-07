import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, 'Category must have a name'],
        unique: true,
        uniqueCaseInsensitive: [true, 'Cant have two categories with the same name']
    },
    state: { type: String, enum: ['Active', 'Archived'], default: 'Active' }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});
categorySchema.plugin(mongooseUniqueValidator);
const Category = mongoose.model('Category', categorySchema);
export { Category };
//# sourceMappingURL=category.js.map