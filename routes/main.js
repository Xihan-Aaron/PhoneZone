const express= require('express')
const router =express.Router();
const main = require('../controllers/main');

router.get('/', (req,res,next)=>{
	console.log(req.session,'Main')
	next()
},
main.main
)

router.get('/home', (req,res,next)=>{
	console.log(req.session,'Main')
	delete req.session.prevUrl
	delete req.session.prevInfo
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

router.post('/addToCart', main.addItemToCart);

router.post('/getCartInfo', main.getCartInfo);

module.exports = router
