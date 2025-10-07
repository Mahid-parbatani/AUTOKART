import express from 'express';
const orderController = require('../controllers/OrderController');
const jwtAuth = require('../middlewear/jwtAuth');
const router = express.Router();

router.route('/')
    .get(jwtAuth.auth, orderController.getAllUserOrders)
    .post(jwtAuth.auth, orderController.createNewOrder)
    .put(jwtAuth.auth, orderController.editExistingOrder)
    .delete(jwtAuth.auth, orderController.removeOrder)

router.route('/id')
    .get(jwtAuth.auth, orderController.getSingleOrder)

    
router.route('/realizeOrder')
    .post(jwtAuth.auth, orderController.realizeOrder)
module.exports = router;