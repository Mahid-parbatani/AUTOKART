import { Request, Response } from 'express';
import { Product } from '../entities/productEntity';
const ProductService = require('../services/productService');

const getProductsList = async (req: Request, res: Response) => {
    try{
        const productsList: Product[] = await ProductService.ProductsList();
        res.status(200).json(productsList);
    } catch (error) {
        res.status(500).json({ "message": `${error}`})
    }
}

const getFiltredProductsList = async (req: Request, res: Response) => {
    try{
        const productsList: Product[] = await ProductService.ProductsList(req.body.filter, req.body.value);
        res.status(200).json(productsList);
    } catch (error) {
        res.status(500).json({ "message": `${error}`})
    }
}

const getProductDetails = async (req: Request, res: Response) => {
    try{
        const product: Product = await ProductService.ProductDetails(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ "message": `${error}`})
    }
}

const postNewProduct = async (req: Request, res: Response) => {
    try{
        const newproduct: Product = await ProductService.addProduct(req.body);
        res.status(200).json(newproduct);
    } catch (error) {
        res.status(500).json({ "message": `${error}`})
    }
}

const deleteProduct = async (req: Request, res: Response) => {
    try{
        const result = await ProductService.removeProduct(req.body.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ "message": `${error}`})
    }
}

const putProductDetails = async (req: Request, res: Response) => {
    try{
        const newproduct: Product = await ProductService.changeProductDetails(req.body.id, req.body);
        res.status(200).json(newproduct);
    } catch (error) {
        res.status(500).json({ "message": `${error}`})
    }
}

module.exports = {
    getProductsList, getProductDetails, postNewProduct, deleteProduct, putProductDetails, getFiltredProductsList
}