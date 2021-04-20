const express= require('express')
const router =express.Router();


router.get('/', (req,res,next)=>{
	console.log(req.session.user_id)
	res.render('main.ejs',{user_id:req.session.user_id})
})




module.exports = router