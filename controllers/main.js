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
		if(req.session.auth==true){
			prevUrl = req.session.prevUrl
			prevInfo = req.session.prevInfo
			delete req.session.prevUrl
			delete req.session.prevInfo
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
		user_id = req.session.user_id

		userFromDb = await User.getUserById(user_id)
		if(userFromDb == null) {
			res.render('main.ejs')
		}
		var exists = false
		var checkingExisting = await User.checkExisting(user_id,item_id)
		if(checkingExisting != null) {
			var exists = true
		}

		if(!exists) {
			var itemToAdd = {id:item_id,quantity:item_quantity}
			var item = await User.addToCart(user_id,itemToAdd)
		} else {
			var item = await User.addExistingToCart(user_id,item_id,item_quantity)
		}

	}catch(err){
		err.statusCode=500
		next(err)
	}
}
