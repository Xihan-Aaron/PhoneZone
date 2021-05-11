const express= require('express')
const router =express.Router();
const mainCheckout = require('../controllers/main');

router.get('/', (req,res,next)=>{
	console.log(req.session.user_id,'Main')
	next()
},
mainCheckout.main
)

router.post('/',function (req, res,next) {
	searchtext = req.body.searchtext
	if(searchtext == undefined) {
		return next('route')
	}
	next()
},
mainCheckout.search
)

router.post('/',function (req, res,next) {
	selectItem = req.body.selectItem

	if(selectItem == undefined) {
		next('route')
	}
	next()
},
mainCheckout.selectItem
)

router.post('/',function (req, res,next) {
	next()
},
mainCheckout.main
)

router.post('/search',function (req, res,next) {
	next()
},
mainCheckout.search
)

router.post('/item',function (req, res,next) {
	next()
},
mainCheckout.selectItem
)

router.post('/addToCart', mainCheckout.addItemToCart);


module.exports = router
