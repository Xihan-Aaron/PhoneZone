var express = require('express');
var crypto = require('crypto');
const User = require('../models/users');


module.exports.signup = async function (req,res,next){
	if(req.session.success==false){
		return res.status(400).json({errors: req.session.errors, success:req.session.success})
		//return res.render('signup.ejs',{errors: req.session.errors, success:req.session.success});
	}
	try{
		const hashPassword= await crypto.createHash('md5').update(req.body.password).digest("hex");
		const userInformation = new User({
			firstname: req.body.firstname,
			lastname: req.body.lastname,
		    email: req.body.email,
		    password: hashPassword
		})
		userFromDb = await User.getUserByEmail(req.body.email)
		if(userFromDb==null){
			const addedUser = await User.addUser(userInformation)
			req.session.success=true
			req.session.user_id=addedUser._id
		}else{
			req.session.success=false		
			req.session.errors['email'].push('Email already exists')
		}
	}catch(err){
		req.session.success=false
		req.session.errors['server']=[]		
		req.session.errors['server'].push('Server side Error: '+err["codeName"])
		return res.status(500).json({errors: req.session.errors, success:req.session.success})
	}
	if(req.session.success==false){
		return res.status(400).json({errors: req.session.errors, success:req.session.success})
		//return res.render('signup.ejs',{errors: req.session.errors, success:req.session.success});
	}else{
		return res.redirect('/');
	}
}

module.exports.signin = async function(req,res,next){
	errors=[]
	req.session.success=true
	try{
		userFromDb = await User.getUserByEmail(req.body.email)
		if(userFromDb ==null){
			errors.push("Email not Found")
		}else{
			const hashPasswordBrowser= await crypto.createHash('md5').update(req.body.password).digest("hex");
			if (userFromDb.password===hashPasswordBrowser){
				req.session.user_id=userFromDb._id
				req.session.success=false
				return res.redirect('/');
			}else{
				errors.push("Incorrect Combination of Password and Email")
			}
		}
	}catch(err){
		errors.push('Server side error: '+err["codeName"])
		req.session.success=false
		return res.status(500).json({errors: req.session.errors, success:req.session.success})
	}
	return res.status(400).json({errors:errors})
}