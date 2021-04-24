const express= require('express')
const router =express.Router();
const mainCheckout = require('../controllers/main');

router.get('/', (req,res,next)=>{
	console.log(req.session.user_id)
	next()
},
mainCheckout.main
)




module.exports = router