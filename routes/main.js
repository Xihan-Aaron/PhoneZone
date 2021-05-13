const express= require('express')
const router =express.Router();
const main = require('../controllers/main');

router.get('/', (req,res,next)=>{
	console.log(req.session.user_id,'Main')
	next()
},
main.main
)

router.post('/',function (req, res,next) {
	searchtext = req.body.searchtext
	if(searchtext == undefined) {
		return next('route')
	}
	next()
},
main.search
)

router.post('/',function (req, res,next) {
	selectItem = req.body.selectItem

	if(selectItem == undefined) {
		next('route')
	}
	next()
},
main.selectItem
)

router.post('/',function (req, res,next) {
	next()
},
main.main
)

router.post('/search',function (req, res,next) {
	next()
},
main.search
)

router.post('/item',function (req, res,next) {
	next()
},
main.selectItem
)

router.post('/addToCart', mainCheckout.addItemToCart);

router.post('/getCartInfo', mainCheckout.getCartInfo);

module.exports = router
