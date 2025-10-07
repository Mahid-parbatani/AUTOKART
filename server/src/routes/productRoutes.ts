import express from 'express';
const productController = require('../controllers/ProductController');
const jwtAuth = require('../middlewear/jwtAuth');
const router = express.Router();

router.route('/')
    .get(jwtAuth.auth, productController.getProductsList)
    .post(jwtAuth.auth, productController.postNewProduct)
    .put(jwtAuth.auth, productController.putProductDetails)
    .delete(jwtAuth.auth, productController.deleteProduct)

router.route('/filter')
    .get(jwtAuth.auth, productController.getFiltredProductsList)

router.route('/:id')
    .get(jwtAuth.auth, productController.getProductDetails)

module.exports = router;