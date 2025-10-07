import mongoose, { Schema } from 'mongoose';
import { Product } from '../entities/productEntity'

const productSchema = new Schema<Product>({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    carBrand: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    availability: {
        type: Boolean,
        default: true
    },
    imageUrl: {
        type: String,
    }
});

module.exports =  mongoose.model<Product>('productModel', productSchema);