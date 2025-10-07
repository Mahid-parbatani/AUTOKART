import { Request, Response } from 'express';
import { CustomRequest } from '../middlewear/jwtAuth';
const UserService = require('../services/userService');

const registerUser = async (req: Request, res: Response) => {
    try {
        await UserService.register(req.body);
        res.status(200).json({ "message": `Register completed` });
    } catch (error) {
        return res.status(500).json({ "message": `${error}`});
    }
}

const loginUser = async (req: Request, res: Response) => {
    try {
        const foundUser = await UserService.login(req.body);
        res.status(200).json(foundUser);
    } catch (error) {
        return res.status(500).json({ "message": `${error}`});
    }
}

const logoutUser = async (req: CustomRequest, res: Response) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        await UserService.logout(token);
        res.status(202).json({ "message": `Logout completed` });
    } catch (error) {
        return res.status(500).json({ "message": `${error}`});
    }
}

module.exports = { registerUser, loginUser, logoutUser };