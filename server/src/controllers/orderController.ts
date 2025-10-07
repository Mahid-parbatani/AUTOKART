import { Request, Response } from 'express';
import { Order } from '../entities/orderEntity';
const PaymentService = require('../services/paymentService');
const OrderService = require('../services/orderService');

const getAllUserOrders = async (req: Request, res: Response) => {
    try{
        const orders: Order[] = await OrderService.getOrdersByEmail(req.body.email);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ "message": `${error}`});
    }
}

const getSingleOrder = async (req: Request, res: Response) => {
    try{
        const order: Order = await OrderService.getOrderById(req.body.id);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ "message": `${error}`});
    }
}

const removeOrder = async (req: Request, res: Response) => {
    try{
        const result = await OrderService.deleteOrder(req.body.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ "message": `${error}`});
    }
}

const editExistingOrder = async (req: Request, res: Response) => {
    try{
        const editedOrder: Order = await OrderService.editOrder(req.body.id, req.body.email , req.body.productsList, req.body.address);
        res.status(200).json(editedOrder);
    } catch (error) {
        res.status(500).json({ "message": `${error}`});
    }
}

const createNewOrder = async (req: Request, res: Response) => {
    try{
        const newOrder: Order = await OrderService.createOrder(req.body.email , req.body.productsList, req.body.address);
        res.status(200).json(newOrder);
    } catch (error) {
        res.status(500).json({ "message": `${error}`});
    }
}

const realizeOrder = async (req: Request, res: Response) => {
    try {
        const paymentStatus: boolean = await PaymentService.simulatePayment();
        const order: Order = await OrderService.realizeOrder(req.body.id, paymentStatus);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ "message": `${error}`});
    }
}

module.exports = { getAllUserOrders,  getSingleOrder, removeOrder, editExistingOrder, createNewOrder, realizeOrder}