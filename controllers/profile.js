var express = require('express');
var crypto = require('crypto');
const User = require('../models/users');


module.exports.profilePage = async function(req,res,next){
	try{
		userFromDb = await User.getUserById(req.session.user_id)
		if(userFromDb ==null){
			redirect('/')
		}else{
			userInfo = 
			{
				firstname:userFromDb.firstname,
				lastname:userFromDb.lastname,
				email:userFromDb.email,
			}
			res.render('profile/profile.ejs',{userInfo:userInfo,errors: req.session.errors, success:req.session.success,})
		}
	}catch(err){
		err.statusCode=500
		next(err)
	}
}

module.exports.editProfilePage = async function(req,res,next){
	errors={}
	updateInfo={}
	editAttributes=req.session.editAttributes
	for(attrName in editAttributes){
		attrErrorArray = req.session.errors[attrName]
		if(attrErrorArray.length>0){
			errors[attrName]=attrErrorArray
		}
	}
	//Atomic meaning that unless all validation passes, it will not send to the server
	if(Object.keys(errors).length>0){
		req.session.success=false
		return res.status(400).json({errors: errors, success:req.session.success})
		//return res.render('profile/profile.ejs',{errors: req.session.errors, success:req.session.success, userInfo:userInfo});
	}else{
		try{
			if("email" in editAttributes){
				const checkDuplicate=await User.getUserByEmail(editAttributes["email"])
				if(checkDuplicate!==null){
					errors["email"]="The email already exists"
					req.session.success=false
					return res.status(200).json({errors:errors, success:req.session.success})
				}
			}
			const updatingUser = await User.updateUser(req.session.user_id,editAttributes)
			const updatedUser = await User.getUserById(req.session.user_id)
			req.session.success=true
			userInfo = 
			{
				firstname:updatedUser.firstname,
				lastname:updatedUser.lastname,
				email:updatedUser.email,
			}
			return res.status(200).json({errors:errors, success:req.session.success})
			//return res.render('profile/profile.ejs',{errors: req.session.errors, success:req.session.success, userInfo:userInfo});
		}catch(err){
			req.session.success=false
			errors['server']=[]
			errors['server'].push('Server Side Error:'+err["codeName"])
			return res.status(400).json({errors: errors, success:req.session.success})
		}
	}
}

module.exports.editPassword = async function(req,res,next){
	try{
		const currentUser = await User.getUserById(req.session.user_id)
		const hashCurrentPassword= await crypto.createHash('md5').update(req.body.currentPassword).digest("hex")
		const hashNewPasword= await crypto.createHash('md5').update(req.body.newPassword).digest("hex")
		if(currentUser!=null && currentUser.password===hashCurrentPassword&&req.session.success!=false){
			editAttributes={password:hashNewPasword}
			const updatingUser = await User.updateUser(req.session.user_id,editAttributes)
			req.session.success=true
			return res.status(200).json({errors:req.session.errors, success:req.session.success})
		}else{
			if(currentUser==null){//Shouldn't happen since we have a middlewear that checks the user_id 
				const error = new Error('Server Error. Incorrect User was logged in');
	  			error.statusCode = 500;
	  			next(error);
			}
			if(currentUser.password!==hashCurrentPassword){
				req.session.errors["currentPassword"]=['Please enter the correct current password']
				req.session.success=false
			}
			console.log("not good")
			return res.status(400).json({errors: req.session.errors, success:req.session.success})
		}
	}catch(err){
		req.session.success=false
		req.session.errors['server']=[]
		req.session.errors['server'].push('Server Side Error:'+err["codeName"])
		return res.status(400).json({errors: errors, success:req.session.success})
	}
	
}	