const express= require('express')
const router =express.Router();
const mainCheckout = require('../controllers/main');

router.get('/', (req,res,next)=>{
	console.log(req.session.user_id)
	next()
},
mainCheckout.main
)

router.post('/',(req,res,next)=> {
	console.log("main post")
	test = req.body.searchtext
	console.log(test)
		next()
},
mainCheckout.search
)

router.post('/selectItem', (req,res,next)=> {
		next()
},
mainCheckout.selectItem
)


module.exports = router
