
import mongoose, { Schema, Document, Model } from 'mongoose';

interface IProductDocument extends IProduct, Document {}

const productSchema = new Schema({
    seller_id: {
        type: String,
        required: true,
        seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    state: {
        type: String,
        enum: ['Active', 'Archived'],
        required: false
    }
},
{
    timestamps: true
});


const Product: Model<IProductDocument> = mongoose.model<IProductDocument>('Product', productSchema)

export  {Product , IProductDocument};
