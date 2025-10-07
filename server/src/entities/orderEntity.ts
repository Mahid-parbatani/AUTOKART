import { Document } from 'mongoose';
import { Product } from './productEntity'
import { Address } from './addressEntity'

export interface Order extends Partial<Document>{
    email: string;
    products: Product[];
    price: number;
    date: string;
    address: Address;
    realized?: boolean
}