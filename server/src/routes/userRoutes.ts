import express from 'express';
const userController = require('../controllers/UserController');
const jwtAuth = require('../middlewear/jwtAuth');
const router = express.Router();

router.route('/login')
    .post(userController.loginUser)

router.route('/register')
    .post(userController.registerUser)

router.route('/logout')
    .post(jwtAuth.auth, userController.logoutUser)  

    
module.exports = router;