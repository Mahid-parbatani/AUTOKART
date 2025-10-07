import mongoose, { Schema } from 'mongoose';
import { Address } from '../entities/addressEntity'

const addressSchema = new Schema<Address>({
    streetName: {
        type: String,
        required: true
    },
    apartmentNumber: {
        type: Number,
        required: true
    },
    doorNumber: {
        type: Number,
        required: false
    },
    postCode: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },

});

module.exports = mongoose.model<Address>('addressModel', addressSchema);