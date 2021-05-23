const express= require('express')
const router =express.Router();
const main = require('../controllers/main');

router.get('/', (req,res,next)=>{
	next()
},
main.main
)

router.get('/home', (req,res,next)=>{
	delete req.session.prevUrl
	delete req.session.prevInfo
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

router.post('/getQuantityInCart', main.getQuantityInCart);

module.exports = router
