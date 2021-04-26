const express= require('express')
const router =express.Router();
const checkoutController = require('../controllers/checkout');

router.get('/', checkoutController.checkoutPage)


module.exports = router