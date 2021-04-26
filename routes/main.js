const express= require('express')
const router =express.Router();
const mainCheckout = require('../controllers/main');

router.get('/', (req,res,next)=>{
	console.log(req.session.user_id)
	next()
},
mainCheckout.main
)

router.post('/search', (req,res,next)=> {
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
