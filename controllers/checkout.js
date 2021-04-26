var express = require('express');
var crypto = require('crypto');
const User = require('../models/users');


module.exports.checkoutPage = async function(req,res,next){
	try{
		userFromDb = await User.getUserById(req.session.user_id)
		if(userFromDb ==null){
			redirect('/')
		}else{
			res.render('checkout.ejs')
		}
	}catch(err){
		err.statusCode=500
		next(err)
	}
}