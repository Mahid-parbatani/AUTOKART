import mongoose, { Model } from "mongoose";
import { Product } from '../entities/productEntity';
import { UpdateProductI } from '../entities/updateProductEntity';
const productDB: Model<Product> = require('../model/Product');


const ProductsList = async () => {
    const products: Product[] = await productDB.find();

    if (!products){
        throw new Error(`No product found`);
    }

    return products;
}

const FiltredProductsList = async (filter: string, value: string) => {
    const products: Product[] = await productDB.find({category: value}).exec();

    if (!products){
        throw new Error(`No product found`);
    }
    
    return products;
}

const ClearDataBase = async () => {
    try {
        // Usuń wszystkie dokumenty z kolekcji
        const result = await productDB.deleteMany({});
        console.log(`Usunięto ${result.deletedCount} dokumentów.`);
    } catch (error) {
        console.error('Błąd podczas czyszczenia bazy danych:', error);
    }
}


const ProductDetails = async (id: string) => {
    const foundProduct: Product|null = await productDB.findOne({_id: id}).exec();
    
    if (!foundProduct){
        throw new Error(`Product ID ${id} not found`);
    } 
    return foundProduct;
}

const addProduct = async (product: Product) => {
    
    if (product.availability === null || product.amount <= 0) {
        product.availability = false;
    }

    const newProduct: Product = await productDB.create(product);
    return newProduct;
}

const removeProduct = async (id: string) => {
    const product: Product = await ProductDetails(id);
    return await product.deleteOne({ _id: id });
}

const changeProductDetails = async (id: string, productParamethers: UpdateProductI) => {

    let product: Product = await ProductDetails(id);

    const updatedProduct = await productDB.findOneAndUpdate(
        { _id: id }, {
            $set: {
                name: productParamethers.name ? productParamethers.name : product.name,
                price: productParamethers.price ? productParamethers.price : product.price,
                category: productParamethers.category ? productParamethers.category : product.category,
                carBrand: productParamethers.carBrand ? productParamethers.carBrand : product.carBrand,
                description: productParamethers.description ? productParamethers.description : product.description,
                availability: productParamethers.availability ? productParamethers.availability : product.availability,
                ammount: productParamethers.amount ? productParamethers.amount : product.amount
            }
        },
        { new: true }
    );

    return updatedProduct;
}


const updateProductAvailability = async (id: string, quantityToBuy: number) => {

        const product: Product = await ProductDetails(id);
        if (product.availability) {
            const remainingAmount = product.amount - quantityToBuy;

            if (remainingAmount > 0) {
                product.amount = remainingAmount;

            } else if (remainingAmount === 0) {
                product.amount = remainingAmount;
                product.availability = false;

            } else {
                throw new Error(`Current stock is ${product.amount}, but attempting to buy ${quantityToBuy}. It's impossible to complete the purchase.`);
            }

            await product.save();
            return product;

        } else {
            throw new Error(`Item ${product.name} is no availabilible`);    
        }
}


module.exports = {ProductsList, ProductDetails, addProduct, removeProduct, changeProductDetails, updateProductAvailability, FiltredProductsList}