import mongoose, { Model } from "mongoose";
import { Address } from '../src/entities/addressEntity';
const AddressService = require('../src/services/addressService');
const addressDB: Model<Address>  = require('../src/model/Address');
const DATABASE_URL=`mongodb+srv://carparts:carparts@carparts.mgmpyqm.mongodb.net/?retryWrites=true&w=majority&appName=CarParts`


const connectDB = async () => {
    try {
        await mongoose.connect(DATABASE_URL);
    } catch (error) {
        console.log(error);
    }
}

beforeAll(() => {
    connectDB();
});


describe('address tests', () => {
    const newAddress: Address = {
        streetName: 'test streetName',
        apartmentNumber: 123,
        doorNumber: 456,
        postCode: 'test postCode',
        city: 'test city',
        country: 'test country'
    }; 
    test('create adress', async () => {
        try {
            const addressObject: Address = await AddressService.createAddress(newAddress);
            const foundAddressObject = await addressDB.findOne({_id: addressObject._id});
            expect(foundAddressObject).toBeDefined();

            if (foundAddressObject){
                expect(foundAddressObject.streetName === newAddress.streetName && foundAddressObject.streetName === addressObject.streetName).toBe(true);
                expect(foundAddressObject.apartmentNumber === newAddress.apartmentNumber && foundAddressObject.apartmentNumber === addressObject.apartmentNumber).toBe(true);
                expect(foundAddressObject.doorNumber === newAddress.doorNumber && foundAddressObject.doorNumber === addressObject.doorNumber).toBe(true);
                expect(foundAddressObject.postCode === newAddress.postCode && foundAddressObject.postCode === addressObject.postCode).toBe(true);
                expect(foundAddressObject.city === newAddress.city && foundAddressObject.city === addressObject.city).toBe(true);
                expect(foundAddressObject.country === newAddress.country && foundAddressObject.country === addressObject.country).toBe(true);
            }
        } catch (error) {
            console.log(error);
        };

    })
})