var express = require('express');
var crypto = require('crypto');
const User = require('../models/users');


module.exports.profilePage = async function(req,res,next){
	try{
		userFromDb = await User.getUserById(req.session.user_id)
		if(userFromDb ==null){
			redirect('/')
		}else{
			res.render('profile/profile.ejs',{
				firstname:userFromDb.firstname,
				lastname:userFromDb.lastname,
				email:userFromDb.email,
			})
		}
	}catch(err){
		err.statusCode=500
		next(err)
	}
}

module.exports.editProfilePage = async function(req,res,next){
	console.log(req.session)
}