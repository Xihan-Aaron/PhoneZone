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
	res.redirect('/')
})

router.post('/',main.main)


router.post('/search',main.search)

router.post('/item',main.selectItem)

router.post('/addToCart', main.addItemToCart);

router.post('/addReview', main.addReview);

router.post('/getCartInfo', main.getCartInfo);

router.post('/getQuantityInCart', main.getQuantityInCart);

module.exports = router
