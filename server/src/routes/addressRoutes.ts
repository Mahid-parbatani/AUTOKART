import express from 'express';
const addressController = require('../controllers/addressController');
const jwtAuth = require('../middlewear/jwtAuth');
const router = express.Router();

router.route('/')
    .get(jwtAuth.auth, addressController.getAddress)
    .post(jwtAuth.auth, addressController.createAddress)

module.exports = router;