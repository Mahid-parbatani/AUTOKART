import { Document } from 'mongoose';

export interface Address extends Partial<Document> {
    streetName: string;
    apartmentNumber: number;
    doorNumber?: number;
    postCode: string;
    city: string;
    country: string;
}