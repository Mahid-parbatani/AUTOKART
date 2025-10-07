import mongoose, { Model } from "mongoose";
import { Order } from '../entities/orderEntity';
import { Address } from '../entities/addressEntity';
import { Product } from '../entities/productEntity';
const ProductService = require('../services/productService');
const orderDB: Model<Order>  = require('../model/Order');

const createOrder = async (email: string, productsList: Product[], address: Address) => {

    if (!address || !email || !productsList.length) {
        if (!address) {
            throw new Error("Address is missing");
        }
        if (!email) {
            throw new Error("Email is missing");
        }
        if (!productsList.length) {
            throw new Error("No products provided");
        }
    }

    let sumProductPrice: number = 0;

    for (let product of productsList){
        let singleProduct = await ProductService.ProductDetails(product);
        sumProductPrice += singleProduct.price;
    }

    const newOrder: Order = {
        email: email,
        products: productsList,
        price: sumProductPrice,
        date: new Date().toLocaleString('pl-PL'),
        address: address,
    }

    return await orderDB.create(newOrder);
}

const getOrdersByEmail = async (email: string) => {
    const foundOrder: Order|null|Order[] = await orderDB.find({email: email}).exec();

    if (!foundOrder || foundOrder !== null){
        throw new Error("Order not found");
    }

    return foundOrder;
}

const getOrderById = async (id: string): Promise<Order> => {
    const foundOrder: Order | null = await orderDB.findOne({ _id: id }).exec();

    if (!foundOrder) {
        throw new Error("Order not found");
    }

    return foundOrder as Order;
};

const deleteOrder = async (id: string) => {
        const foundOrder: Order = await getOrderById(id);
        return orderDB.deleteOne({ _id: foundOrder._id });
}

const editOrder = async (id: string, email: string, productsList: Product[], address: Address) => {
   
    if (!address || !email || !productsList.length) {
        if (!address) {
            throw new Error("Address is missing");
        }
        if (!email) {
            throw new Error("Email is missing");
        }
        if (!productsList.length) {
            throw new Error("No products provided");
        }
    }

    let sumProductPrice: number = 0;

    for (let product of productsList){
        sumProductPrice += product.price;
    }

    const editedOrder: Order = {
        email: email,
        products: productsList,
        price: sumProductPrice,
        date: new Date().toLocaleString('pl-PL'),
        address: address
    }

    const foundOrder: Order = await getOrderById(id);
    
    return await orderDB.findOneAndUpdate({ _id: foundOrder._id }, editedOrder, { new: true });   
}

const realizeOrder = async (id: string, successful: boolean) => {
    if (successful) { 
        const foundOrder: Order = await getOrderById(id);
        
        for (let item of foundOrder.products) {
            ProductService.updateProductAvailability(item, 1);
        }

        const editedOrder: Order = {
            email: foundOrder.email,
            products: foundOrder.products,
            price: foundOrder.price,
            date: new Date().toLocaleString('pl-PL'),
            address: foundOrder.address,
            realized: true
        }
        
        return await orderDB.findOneAndUpdate({ _id: foundOrder._id }, editedOrder, { new: true });
    } else {
        throw new Error('payment was not successful, cant finish realizing your order')
    }
}


module.exports = { createOrder, getOrdersByEmail,  deleteOrder, editOrder, getOrderById, realizeOrder}
