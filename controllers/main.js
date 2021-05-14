var express = require('express');
var crypto = require('crypto');
const User = require('../models/users');
const PhoneListing = require('../models/phoneListing');
const helper = require('./helper');


module.exports.main = async function(req,res,next){
	try{
		topFive = await PhoneListing.getTopFive();
		soldOut = await PhoneListing.soldOut();
		info={}
		info['topFive']=topFive
		info['soldOut']=soldOut
		if(req.session.prevUrl != undefined){
			prevUrl = req.session.prevUrl
			prevInfo = req.session.prevInfo
			delete req.session.auth
			// res.json({
			// 	user_id:req.session.user_id,
			// 	info:prevInfo,
			// 	tab:prevUrl
			// })
			return res.render('main.ejs',{user_id:req.session.user_id,info:prevInfo,tab:prevUrl})
		}else{
			req.session.prevInfo = info
			req.session.prevUrl = 'main'
			// res.json({
			// 	user_id:req.session.user_id,
			// 	info:info,
			// 	tab:'main'
			// })
			return res.render('main.ejs',{user_id:req.session.user_id,info:info,tab:'main'})
		}


	}catch(err){
		err.statusCode=500
		next(err)
	}
}

module.exports.search = async function(req,res,next){
	try{
		searchtext = req.body.searchtext
		searchResults = await PhoneListing.getMatchingItems(searchtext);
		req.session.prevInfo = searchResults
		req.session.prevUrl = 'search'
	}catch(err){
		err.statusCode=500
		next(err)
	}
	// res.render('main.ejs',{user_id:req.session.user_id,searchResults:searchResults,tab:'search'})
	res.json({
		user_id:req.session.user_id,
		searchResults:searchResults
	});
}

module.exports.selectItem = async function(req,res,next){
	try{
		item_id = req.body.id
		items = await PhoneListing.getItemById(item_id)
		item = (await helper.extractNames([items]))[0]
		req.session.prevInfo = item
		req.session.prevUrl = 'item'
		// fullname = seller.firstname + seller.lastname
		// res.render('main.ejs',{user_id:req.session.user_id, info:item, tab:'item'})
		return res.json({
			user_id:req.session.user_id,
			info:item
		});

	}catch(err){
		err.statusCode=500
		next(err)
	}
}

module.exports.addItemToCart = async function(req,res,next){
	try{
		item_id = req.body.id
		item_quantity = parseInt(req.body.quantity)
		if(req.body.id == undefined || isNaN(req.body.quantity)) {
			return res.json({error:"Invalid inputs"})
		}
		item_price = parseFloat(req.body.price)

		user_id = req.session.user_id
		userFromDb = await User.getUserById(user_id)
		if(userFromDb == null) {
			return res.json({error:"signin"})
		}
		var exists = false
		var checkingExisting = await User.checkExisting(user_id,item_id)
		if(checkingExisting != null) {
			var exists = true
		}
		console.log("pre-getitem");
		item = await PhoneListing.getItemById(item_id)
		console.log("post-getitem",parseInt(item.stock),item_quantity);
		if(parseInt(item.stock) >= item_quantity) {
			if(!exists) {
				var itemToAdd = {id:item_id,quantity:item_quantity,price:item_price}
				console.log(itemToAdd);
				var item = await User.addToCart(user_id,itemToAdd)
			} else {
				var item = await User.addExistingToCart(user_id,item_id,item_quantity)
			}

		} else {
			error = "too many, current stock: " + item.stock
			return res.json({error:error})

		}


		return


	}catch(err){
		err.statusCode=500
		next(err)
	}
}

module.exports.getCartInfo = async function(req,res,next){
	try{
		user_id = req.session.user_id
		userFromDb = await User.getUserById(user_id)
		if(userFromDb == null) {
			return
		}

		cartInfo = await User.getCartInfo(userFromDb._id)
		console.log("cartInfo:",cartInfo[0].cartQuantity);

		return res.json({
			cartQuantity:cartInfo[0].cartQuantity,
			cartPrice:cartInfo[0].cartPrice
		});

	}catch(err){
		err.statusCode=500
		next(err)
	}
}
