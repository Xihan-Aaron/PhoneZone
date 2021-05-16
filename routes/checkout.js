const express= require('express')
const router =express.Router();
const checkoutController = require('../controllers/checkout');

router.get('/', checkoutController.checkoutPage);

// router.post('/changeQuantity', checkoutController.changeQuantity);

router.post('/removeFromCart', checkoutController.removeFromCart);

router.post('/clearCart', checkoutController.clearCart);

router.post('/changeQuantity'
	,(req,res,next)=>{
		req.session.success=true
		req.session.errors={}
		next()
	}
	,checkoutController.changeQuantity)

router.post('/verifyQuantiy', checkoutController.verifyQuantiy);

module.exports = router
