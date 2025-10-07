import mongoose, { Schema } from 'mongoose';
import { Order } from '../entities/orderEntity';

const orderSchema = new Schema<Order>({
    email: {
        type: String,
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'productModel',
        required: true
    }],
    price: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'addressModel',
        required: true
    },
    realized: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model<Order>('orderModel', orderSchema);
