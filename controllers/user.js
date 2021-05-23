var express = require('express');
var crypto = require('crypto');
const User = require('../models/users');
var nodemailer = require('nodemailer');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const jwt = require('jsonwebtoken')

var secretKey = "helloWorld"

module.exports.signup = async function (req,res,next){
	if(req.session.success==false){
		return res.status(400).json({errors: req.session.errors, success:req.session.success})
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
	}else{
		req.session.auth=true;
		return res.status(200).json({success:req.session.success});
	}
}

module.exports.signin = async function(req,res,next){
	errors=[]
	req.session.success=true
	try{
		userFromDb = await User.getUserByEmail(req.body.email)

		if(userFromDb ==null){
			errors.push("Email not Found")
			req.session.success=false
		}else{
			const hashPasswordBrowser= await crypto.createHash('md5').update(req.body.password).digest("hex");
			if (userFromDb.password===hashPasswordBrowser){
				req.session.user_id=userFromDb._id
				req.session.success=true
				req.session.auth=true;
				return res.status(200).json({success:req.session.success});
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

module.exports.forgotPassword = async function(req,res,next){
	var email = req.body.email
	console.log("hello")
	try{
		userFromDb = await User.getUserByEmail(req.body.email)
		if(userFromDb ==null){
			res.status(400).json({success:false,message:"Email does not exist. Please sign up"})
		}else{
			var token = jwt.sign({email},secretKey,{expiresIn:'10m'})
			var transporter = nodemailer.createTransport(smtpTransport({
				service: 'gmail',
				host: 'smtp.gmail.com',
				auth: {
					user: 'phonezonecomp5347@gmail.com',
					pass: 'helloWorld'
			  		}
			}));

			var info = {resetLink: token}
			updateUser = await User.updateUser(userFromDb._id,info)

			htmlString = `<p>Please click on this link to rest your password <a href='http://localhost:3000/users/restPassword/${token}'>Reset Password </a></p>`
			var mailOptions = {
			  from: 'phonezonecomp5347@gmail.com',
			  to: email,
			  subject: 'Restore Password',
			  html: htmlString
			};

			transporter.sendMail(mailOptions, function(error, info){
			  if (error) {
			    res.status(400).json({success:false,message:"Error in Sending the email"})
			  } else {


			    res.status(200).json({success:true,message:"An email has been sent"})
			  }
			});
		}
	}
	catch(err){
		errors.push('Server side error: '+err["codeName"])
		req.session.success=false
		return res.status(500).json({errors: req.session.errors, success:req.session.success})
	}

}


module.exports.resetPassword = function(req,res,next) {
	if(req.session.success==false){
		return res.status(400).json({errors: req.session.errors, success:req.session.success})
	}
	var token = req.session.token
	if(token){
		jwt.verify(token,secretKey,async function(error, data){
			req.session.errors["token"]=[]
			if(error){
				req.session.errors["token"].push("Incorrect token is used. Please try resending the password again. ")
				return res.status(400).json({errors: req.session.errors, success:false})
			}else{
				var email = data["email"]
				userFromDb = await User.getUserByEmail(email)
				if(userFromDb ==null){
					req.session.errors["confirmPassword"]="Email does not exist. Please sign up"
					res.status(400).json({success:false,errors: req.session.errors})
				}else{
					try{
						if(userFromDb["resetLink"]===token){
							const hashNewPasword= await crypto.createHash('md5').update(req.body.password).digest("hex")
							editAttributes={password:hashNewPasword,resetLink:''}
							const updatingUser = await User.updateUser(userFromDb._id,editAttributes)
							req.session.success=true
							req.session.user_id=userFromDb._id
							return res.status(200).json({errors:req.session.errors, success:req.session.success})
						}else{
							req.session.errors["token"].push("Incorrect token is used. Please try resending the password again. ")
							return res.status(400).json({errors: req.session.errors, success:false})
						}
					}catch(err){
						req.session.errors["token"].push('Server side error: '+err["codeName"])
						req.session.success=false
						return res.status(500).json({errors: req.session.errors, success:req.session.success})
					}
				}

			}
		})
	}


}
