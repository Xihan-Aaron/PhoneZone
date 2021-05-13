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

router.post('/addToCart',
// function (req, res,next) {
// 	if(req.session.user_id == undefined) {
// 		res.redirect('/users/signin')
// 	}
// 	next()
// },
mainCheckout.addItemToCart);

router.post('/getCartInfo',
mainCheckout.getCartInfo);

module.exports = router
