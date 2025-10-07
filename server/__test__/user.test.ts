import mongoose, { Model } from "mongoose";
import { User } from '../src/entities/userEntity';
const UserService = require('../src/services/userService');
const UserDB: Model<User>  = require('../src/model/User');
const DATABASE_URL=`mongodb+srv://carparts:carparts@carparts.mgmpyqm.mongodb.net/?retryWrites=true&w=majority&appName=CarParts`


const connectDB = async () => {
    try {
        await mongoose.connect(DATABASE_URL);
    } catch (error) {
        console.log(error);
    }
}

beforeAll(async () => {
    connectDB();
    try {
        await UserService.removeUser("testEmail1");
    } catch {

    }
});


describe('address tests', () => {
    let token: string;
    const newUser = {
        email: "testEmail1",
        password: "testPassword"  //remember that passwor is hashed
    };
    
    test('register test', async () => {
        try {

            await UserService.register(newUser);
            const foundUser: User|null = await UserDB.findOne({email: newUser.email});
            expect(foundUser).toBeDefined();

            if (foundUser){
                expect(foundUser._id).toBeDefined();
                expect(foundUser.email).toEqual(newUser.email);
            }
            
        } catch (error) {
            console.log(error);
        };
    })

    test('login user', async () => {
        try {
            const loggedUser = await UserService.login(newUser);
            const foundUser = await UserDB.findOne({email: loggedUser.user.email});
            token = loggedUser.token;

            if (foundUser){
                expect(foundUser.email).toEqual(newUser.email);
            }
            expect(loggedUser.token).toBeDefined();

        } catch (error) {
            console.log(error);
        };

    });

    test('logout user', async () => {
        try {
            const result = await UserService.logout(token);
            expect(result).toEqual({ message: 'User logged out successfully' });

        } catch (error) {
            console.log(error);
        };
    });
})