import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../entities/userEntity';
const UserDB = require('../model/User');
const BlacklistedTokenDB = require('../model/BlackListedTokens');
const jwtAuth = require('../middlewear/jwtAuth')

const register = async (user: User) => {
    try {
        await UserDB.create(user);
    } catch (error) {
        console.error(`New error: ${error}`);
        throw error;
    }
}

const login = async (user: User) => {
    const foundUser: User = await UserDB.findOne({email: user.email});
    if (!foundUser) {
        throw new Error('User not found');
    };

    const passwordsMatches: boolean = await bcrypt.compareSync(user.password, foundUser.password);

    if (passwordsMatches) {

        const token: string = jwt.sign({ _id: foundUser._id?.toString(), name: foundUser.email }, jwtAuth.SECRET_KEY, {
                expiresIn: '1 days'});

              return { user: { email: user.email}, token: token };

    } else {
        throw new Error('Password is not correct');
}};

const logout = async (token: string) => {
    try {
        await BlacklistedTokenDB.create({token});
        return { message: 'User logged out successfully' };
    } catch (error) {
        throw new Error(`Error logging out user ${error}`);
    }
};

const removeUser = async (email: string) => {
    try {
    const foundUser: User | null = await UserDB.findOne({ email: email }).exec();

    if (!foundUser) {
        throw new Error("User not found");
    }

    return UserDB.deleteOne({ _id: foundUser._id });
    } catch (error) {
        throw new Error(`Error logging out user ${error}`);
    }
}
    


module.exports = { login, register, logout , removeUser};