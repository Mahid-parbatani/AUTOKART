import  { Document } from 'mongoose';

export interface Product extends Document {
    id?: string,
    name: string;
    price: number;
    category: string;
    carBrand: string;
    description: string;
    amount: number;
    availability?: boolean;
    imageUrl?: string;
}