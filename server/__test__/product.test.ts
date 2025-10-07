import mongoose, { Model } from "mongoose";
import { Product } from '../src/entities/productEntity';
const ProductService = require('../src/services/productService');
const ProductDB: Model<Product> = require('../src/model/Product');
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

describe('products tests', () => {
    const newProduct = {
        name: 'test name',
        price: 123,
        category: 'test category',
        carBrand: 'test carBrand',
        description: 'test description',
        amount: 12,
        availability: true
    }; 

    let id: string = "65e6fb0b646aef5a6f9f3100";

    test('create product', async () => {
        try {
            const createdProduct: Product = await ProductService.addProduct(newProduct);
            // expect(createdProduct).toBeDefined();
            id = createdProduct._id;

            if (createdProduct){
                expect(createdProduct._id).toBeDefined();
                expect(createdProduct.name).toEqual(newProduct.name);
                expect(createdProduct.price).toEqual(newProduct.price);
                expect(createdProduct.category).toEqual(newProduct.category);
                expect(createdProduct.carBrand).toEqual(newProduct.carBrand);
                expect(createdProduct.description).toEqual(newProduct.description);
                expect(createdProduct.amount).toEqual(newProduct.amount);
                expect(createdProduct.availability).toEqual(newProduct.availability);
            }        
        } catch (error) {
            console.log(error);
        };
    })

    test('get products list', async () => {
        try {
            const productsList: Product = await ProductService.ProductsList();
            expect(productsList).toBeDefined();
        } catch (error) {
            console.log(error);
        };
    })

    test('get product details', async () => {
        try {
            const foundProduct: Product = await ProductService.ProductDetails(id);
            if (foundProduct){
                expect(foundProduct.name).toEqual(newProduct.name);
                expect(foundProduct.price).toEqual(newProduct.price);
                expect(foundProduct.category).toEqual(newProduct.category);
                expect(foundProduct.carBrand).toEqual(newProduct.carBrand);
                expect(foundProduct.description).toEqual(newProduct.description);
                expect(foundProduct.amount).toEqual(newProduct.amount);
                expect(foundProduct.availability).toEqual(newProduct.availability);
            }      
        } catch (error) {
            console.log(error);
        };
    })

    test('change product details', async () => {
        const updates = {
            name: 'changedName',
            category: 'changedCategory',
            carBrand: 'changedCarBrand'
        }
        try {
            const updatedProduct: Product = await ProductService.changeProductDetails(id, updates);
            if (updatedProduct){
                expect(updatedProduct.name).toEqual(updates.name);
                expect(updatedProduct.price).toEqual(newProduct.price);
                expect(updatedProduct.category).toEqual(updates.category);
                expect(updatedProduct.carBrand).toEqual(updates.carBrand);
                expect(updatedProduct.description).toEqual(newProduct.description);
                expect(updatedProduct.amount).toEqual(newProduct.amount);
                expect(updatedProduct.availability).toEqual(newProduct.availability);
            }      
        } catch (error) {
            console.log(error);
        };
    })

    test('update product availability 1', async () => {
        const quantityToBuy: number = 2;
        try {
            const updatedProduct: Product = await ProductService.updateProductAvailability(id, quantityToBuy);

            if (updatedProduct){
                expect(updatedProduct.amount).toEqual(10);
                expect(updatedProduct.availability).toEqual(true);
            }      

        } catch (error) {
            console.log(error);
        };
    })

    test('update product availability 2', async () => {
        const quantityToBuy: number = 10;
        try {
            const updatedProduct: Product = await ProductService.updateProductAvailability(id, quantityToBuy);

            if (updatedProduct){
                expect(updatedProduct.amount).toEqual(0);
                expect(updatedProduct.availability).toEqual(false);
            }      
            
        } catch (error) {
            console.log(error);
        };
    })

    test('update product availability 3', async () => {
        const quantityToBuy: number = 3;
        try {
            await ProductService.updateProductAvailability(id, quantityToBuy);
            fail("Expected function to throw an error, but it didn't.");

        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        };
    })


    test('remove product', async () => {
        try {
            const result = await ProductService.removeProduct(id);
            expect(result).toBeDefined();
        } catch (error) {
            console.log(error);
        };
    })
})
