var express = require('express');
var crypto = require('crypto');
const User = require('../models/users');
const PhoneListing = require('../models/phoneListing');
const helper = require('./helper');
const path = require('path');
var fs = require('fs');

module.exports.profilePage = async function(req,res,next){
	try{
		userFromDb = await User.getUserById(req.session.user_id)
		itemsFromSeller = await PhoneListing.getItemsBySeller(req.session.user_id)	
		if(userFromDb ==null){
			redirect('/')
		}else{
			userInfo = 
			{
				firstname:userFromDb.firstname,
				lastname:userFromDb.lastname,
				email:userFromDb.email,
			}
			helper.extractNames(itemsFromSeller)
			.then((items)=>{
				if(items instanceof Error){
					next(items)
				}else{
					res.render('profile/profile.ejs',{userInfo:userInfo,errors: req.session.errors, success:req.session.success,items:items})
				}
			})
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
			return res.status(500).json({errors: errors, success:req.session.success})
		}
	}
}

module.exports.checkPassword = async function(req,res,next){
	errors=[]
	req.session.success=true
	try{
		userFromDb = await User.getUserById(req.session.user_id)
		if(userFromDb !=null){
			const hashPasswordBrowser= await crypto.createHash('md5').update(req.body.password).digest("hex");
			if (userFromDb.password===hashPasswordBrowser){
				req.session.success=true
				return res.status(500).json({errors: errors, success:req.session.success})
			}else{
				errors.push("Incorrect Password")
			}
		}else{
			const error = new Error('Server Error. Incorrect User was logged in');
	  			error.statusCode = 500;
	  			next(error); //Goes to Error Page
		}
	}catch(err){
		errors.push('Server side error: '+err["codeName"])
		req.session.success=false
		return res.status(500).json({errors: req.session.errors, success:req.session.success})
	}
	req.session.success=false
	return res.status(400).json({errors:errors})
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
			return res.status(400).json({errors: req.session.errors, success:req.session.success})
		}
	}catch(err){
		req.session.success=false
		req.session.errors['server']=[]
		req.session.errors['server'].push('Server Side Error:'+err["codeName"])
		return res.status(500).json({errors: errors, success:req.session.success})
	}
	
}	

module.exports.addNewListing = async function(req,res,next){
	if(req.session.success==false){
		fs.unlinkSync('public/'+imagePath);
		return res.status(400).json({errors: req.session.errors, success:req.session.success})
		// return res.render('signup.ejs',{errors: req.session.errors, success:req.session.success});
	}
	var imagePath
	if(req.file!= undefined){
		imagePath = 'images/phone_default_images/'+req.file.filename
	}else{
		imagePath = 'images/phone_default_images/default.jpeg'
	}
	
	try{
		const existingInfo = await PhoneListing.getItemByTitleBrand(req.body.title,req.body.brand)
		if(existingInfo.length==0){
			if(req.body.disabled=='on'){
				var listingInformation
				listingInformation = new PhoneListing({
					title: req.body.title.trim(),
					brand: req.body.brand.trim(),
				    stock: req.body.stock,
				    price: req.body.price,
				    seller: req.session.user_id,
				    image: imagePath,
				    reviews:[],
				    disabled:""
				})
			}else{
				listingInformation = new PhoneListing({
					title: req.body.title.trim(),
					brand: req.body.brand.trim(),
				    stock: req.body.stock,
				    price: req.body.price,
				    seller: req.session.user_id,
				    image: imagePath,
				    reviews:[],
					// disabled: "Not disabled"
				})
			}
			const addLisitng = await PhoneListing.addNewListing(listingInformation)
			req.session.success=true
			console.log(addLisitng)
			return res.status(200).json({errors:req.session.errors, success:req.session.success})
		}else{
			fs.unlinkSync('public/'+imagePath);
			req.session.errors['title']=['There already exists a listing with the same title and brand']
			req.session.success=false
			return res.status(400).json({errors: req.session.errors, success:req.session.success})
		}
	}catch(err){
		console.log(err)
		fs.unlinkSync('public/'+imagePath);
		req.session.success=false
		req.session.errors['server']=[]
		req.session.errors['server'].push('Server Side Error:'+err["codeName"])
		return res.status(500).json({errors: req.session.errors, success:req.session.success})
	}

}

module.exports.removeListing = async function(req,res,next){
	try{
		const deletedItem = await PhoneListing.getItemById(req.body.removeId)
		if(deletedItem !=null){
			if(deletedItem['image'].includes('_')){
			  if (fs.existsSync('public/'+deletedItem['image'])) {
			    fs.unlinkSync('public/'+deletedItem['image'])
			  }
			}
			const deleteNow = await PhoneListing.removeListingById(req.body.removeId)
			if(deleteNow['deleteCount']==1){
				return res.status(200).json({errors:req.session.errors, success:req.session.success})
			}else{
				req.session.success=false
				req.session.errors['item']=[]
				req.session.errors['item'].push('Server Unable to Delete')
				return res.status(400).json({errors:req.session.errors, success:req.session.success})
			}
			
		}
		req.session.success=false
		req.session.errors['item']=[]
		req.session.errors['item'].push('Item has already been deleted')
		return res.status(400).json({errors: req.session.errors, success:req.session.success})
		
	}catch(err){
		req.session.success=false
		req.session.errors['server']=[]
		req.session.errors['server'].push('Server Side Error:'+err["codeName"])
		return res.status(500).json({errors: req.session.errors, success:req.session.success})
	}
}

module.exports.editListing = async function(req,res,next){
	try{
		const editNow = await PhoneListing.updateDisabled(req.body.editId,req.body.disabled)
		if(editNow['nModified']==1){
			return res.status(200).json({errors:req.session.errors, success:req.session.success})
		}else{
			req.session.success=false
			req.session.errors['item']=[]
			req.session.errors['item'].push('Server Unable to Edit')
			return res.status(400).json({errors:req.session.errors, success:req.session.success})
		}	
	}catch(err){
		req.session.success=false
		req.session.errors['server']=[]
		console.log(err)
		req.session.errors['server'].push('Server Side Error:'+err["codeName"])
		return res.status(500).json({errors: req.session.errors, success:req.session.success})
	}
}