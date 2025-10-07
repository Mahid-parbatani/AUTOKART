import { Request, Response } from 'express';
import { Order } from '../entities/orderEntity';
const AddressService = require('../services/addressService');

const createAddress = async (req: Request, res: Response) => {
    try{
        const orders: Order[] = await AddressService.createAddress(req.body);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ "message": `${error}`});
    }
}

const getAddress = async (req: Request, res: Response) => {
    try{
        const orders: Order[] = await AddressService.getAddress(req.body.id);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ "message": `${error}`});
    }
}
module.exports = {createAddress, getAddress}