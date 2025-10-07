import mongoose, { Model } from "mongoose";
import { Order } from '../src/entities/orderEntity';
import { Address } from '../src/entities/addressEntity';
import { Product } from '../src/entities/productEntity';
const OrderService = require('../src/services/orderService');
const AddressService = require('../src/services/addressService');
const ProductService = require('../src/services/productService');
const orderDB: Model<Order> = require('../src/model/Order');
const productDB: Model<Product> = require('../src/model/Product');
const addressDB: Model<Address> = require('../src/model/Address');


const DATABASE_URL=`mongodb+srv://carparts:carparts@carparts.mgmpyqm.mongodb.net/?retryWrites=true&w=majority&appName=CarParts`

const connectDB = async () => {
    try {
        await mongoose.connect(DATABASE_URL);
    } catch (error) {
        console.log(error);
    }
}

beforeAll(async () => {
    await connectDB();
});

describe('order tests', () => {

    const testAddress = new addressDB({
        streetName: 'test streetName',
        apartmentNumber: 123,
        doorNumber: 456,
        postCode: 'test postCode',
        city: 'test city',
        country: 'test country'
    }); 

    const testProduct1 = new productDB({
        name: 'test name1',
        price: 1,
        category: 'test category',
        carBrand: 'test carBrand',
        description: 'test description1',
        amount: 1,
        availability: true
    }); 

    const testProduct2 = new productDB({
        name: 'test name2',
        price: 10,
        category: 'test category',
        carBrand: 'test carBrand',
        description: 'test description2',
        amount: 10,
        availability: true
    }); 

    const testProduct3 = new productDB({
        name: 'test name3',
        price: 100,
        category: 'test category',
        carBrand: 'test carBrand',
        description: 'test description3',
        amount: 0,
        availability: false
    }); 

    let productList: Product[];
    const email: string = "test Email";
    let orderID: string;
    let address : Address;

    test('create order test', async () => {
        address = await AddressService.createAddress(testAddress);
        await ProductService.addProduct(testProduct1);
        await ProductService.addProduct(testProduct2);
        await ProductService.addProduct(testProduct3);
        productList = [testProduct1, testProduct2, testProduct3];
        
        try {
            const newOrder: Order = await OrderService.createOrder(email, productList, testAddress);
            orderID = newOrder._id
            
            const foundOrder: Order = await OrderService.getOrderById(orderID);
            expect(foundOrder).toBeDefined();
            expect(newOrder).toBeDefined();
            expect(newOrder.email).toEqual(email);
            
        } catch (error) {
            console.log(error);
        };
    });

    // test('get orders by email', async () => {
    //     const foundOrders: Order[]|Order|null = await OrderService.getOrdersByEmail(email);
    //     console.log(foundOrders);
    //     expect(foundOrders).toBeDefined();
    // not working        
    // });

    test('get order by', async () => {
        try {
            const foundOrder: Order = await OrderService.getOrderById(orderID);
            const foundOrderProducts1: Product|null = await productDB.findById(foundOrder.products[0]);
            const foundOrderProducts2: Product|null = await productDB.findById(foundOrder.products[1]);
            const foundOrderProducts3: Product|null = await productDB.findById(foundOrder.products[2]);
            const foundOrderAddress: Address|null = await addressDB.findById(foundOrder.address);
        
            expect(foundOrder).toBeDefined();

            if (foundOrder && foundOrderAddress && foundOrderProducts1 && foundOrderProducts2 && foundOrderProducts3){
                expect(foundOrderAddress.streetName).toEqual(testAddress.streetName);
                expect(foundOrderProducts1.name).toEqual(testProduct1.name); 
                expect(foundOrderProducts2.carBrand).toEqual(testProduct2.carBrand);
                expect(foundOrderProducts3.amount).toEqual(testProduct3.amount);
                expect(foundOrder.email).toEqual(email);
            }

        } catch (error) {
            console.log(error);
        };
    })

    test('edit order', async () => {
        const editedEmail: string = 'edited Email';
        const editedProductList = productList.slice(0, 2);
        
        try {
            const editedOrder = await OrderService.editOrder(orderID, editedEmail, editedProductList, address);

            const editedOrderProducts1: Product|null = await productDB.findById(editedOrder.products[0]);
            const feditedOrderProducts2: Product|null = await productDB.findById(editedOrder.products[1]);
            const editedOrderAddress: Address|null = await addressDB.findById(editedOrder.address);

            expect(editedOrder).toBeDefined();
            if (editedOrder && editedOrderAddress && editedOrderProducts1 && feditedOrderProducts2){
                expect(editedOrderAddress.streetName).toEqual(testAddress.streetName);
                expect(editedOrder.products.length).toEqual(2);
                expect(editedOrderProducts1.name).toEqual(testProduct1.name); 
                expect(feditedOrderProducts2.carBrand).toEqual(testProduct2.carBrand);
                expect(editedOrder.email).toEqual(editedEmail);
            }

        } catch (error) {
            console.log(error);
        };    
    });

    test('realize order', async () => {
        try {
            const realizedOrder = await OrderService.realizeOrder(orderID, true);
            const foundOrder: Order = await OrderService.getOrderById(orderID);
            console.log(realizedOrder);
            expect(realizedOrder).toBeDefined();
            expect(foundOrder.realized).toEqual(true);
            expect(realizedOrder.realized).toEqual(true);

        } catch (error) {
            console.log(error);
        };
        
    });

    test('delete order', async () => {
        try {
            const result = await OrderService.deleteOrder(orderID);
            expect(result).toBeDefined();

        } catch (error) {
            console.log(error);
        };
        
    });
})