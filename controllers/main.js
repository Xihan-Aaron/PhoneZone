var express = require('express');
var crypto = require('crypto');
const User = require('../models/users');
const PhoneListing = require('../models/phoneListing');
const helper = require('./helper');


module.exports.main = async function(req,res,next){
	try{
		var topFive = await PhoneListing.getTopFive();
		var soldOut = await PhoneListing.soldOut();
		var info={}
		info['topFive']=topFive
		info['soldOut']=soldOut
		if(req.session.prevUrl != undefined){
			var prevUrl = req.session.prevUrl
			var prevInfo = req.session.prevInfo
			delete req.session.auth
			return res.render('main.ejs',{user_id:req.session.user_id,info:prevInfo,tab:prevUrl})
		}else{
			req.session.prevInfo = info
			req.session.prevUrl = 'main'
			return res.render('main.ejs',{user_id:req.session.user_id,info:info,tab:'main'})
		}


	}catch(err){
		err.statusCode=500
		next(err)
	}
}

module.exports.search = async function(req,res,next){
	try{
		var searchtext = req.body.searchtext
		var searchResults = await PhoneListing.getMatchingItems(searchtext);
		req.session.prevInfo = searchResults
		req.session.prevUrl = 'search'
		res.status(200).json({
			user_id:req.session.user_id,
			searchResults:searchResults
		});
	}catch(err){
		err.statusCode=500
		next(err)
	}

}

module.exports.selectItem = async function(req,res,next){
	try{
		var item_id = req.body.id
		var items = await PhoneListing.getItemById(item_id)
		var item = (await helper.extractNames([items]))[0]
		req.session.prevInfo = item
		req.session.prevUrl = 'item'
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
		var item_id = req.body.id
		var item_quantity = parseInt(req.body.quantity)
		var item_max_quantity = parseInt(req.body.maxQuantity)
		var item_price = parseFloat(req.body.price)

		var user_id = req.session.user_id

		var userFromDb = await User.getUserById(user_id)
		if(userFromDb == null) {
			return res.status(400).json({"status":"fail","message":"Please sign in before adding to Cart","type":"signin"})
		}
		var itemInfo =userFromDb["checkout"].filter(function(item){
			return item['id']==item_id
		})
		if(itemInfo.length>0) {
			var currentQuantity =parseInt(itemInfo[0]["quantity"])
			if(currentQuantity+item_quantity>item_max_quantity){
				return res.status(400).json(
					{"status":"fail"
					,"message":`You already have ${currentQuantity} of this product in your cart. With the addition purchase,
				there will not be enough stock. Please wait for restock`
					,"type":"stock"})
			}
			var item = await User.addExistingToCart(user_id,item_id,item_quantity)
		}
		else{
			var itemToAdd = {id:item_id,quantity:item_quantity,price:item_price}
			var item = await User.addToCart(user_id,itemToAdd)
		}
		return res.status(200).json({"status":"success"})
	}catch(err){
		return res.status(500).json({"status":"fail","message":`Server Side Error`})
	}
}

module.exports.getCartInfo = async function(req,res,next){
	try{
		var user_id = req.session.user_id
		if( user_id == undefined) {
			return res.status(200).json({"status":"fail","message":`Not logged in`})
		}
		userFromDb = await User.getUserById(user_id)
		if(userFromDb == null) {
			return res.status(500).json({"status":"fail","message":`Unable to find user`})
		}else{
			var checkout = userFromDb["checkout"]
			var cartQuantity =0
			var cartPrice= 0
			for(i=0;i<checkout.length;i++){
				cartQuantity+=parseInt(checkout[i]['quantity'])
				cartPrice+=parseFloat(checkout[i]['quantity']*checkout[i]['price'])
			}
			return res.status(200).json({
				"status":"success",
				"cartQuantity":parseInt(cartQuantity),
				"cartPrice":parseFloat(cartPrice).toFixed(2)
			})
		}
	}catch(err){
		return res.status(500).json({"status":"fail","message":`Server Side Error`})
	}
}


module.exports.getQuantityInCart = async function(req,res,next){
	try{
		var user_id = req.session.user_id
		var item_id = req.body.item
		if( user_id == undefined) {
			return res.status(200).json({"status":"fail","message":`Not logged in`})
		} else if( item_id == undefined) {
			return res.status(200).json({"status":"fail","message":`not correct state`})
		}
		var cartQuantity = 0

		var userFromDb = await User.getUserById(user_id)
		if(userFromDb == null) {
			return res.status(500).json({"status":"fail","message":`Unable to find user`})
		}else{
			var results = await User.getQuantityInCart(user_id,item_id)
			if(results[0].checkout.length > 0) {
				cartQuantity = results[0].checkout[0].quantity
			}

			return res.status(200).json({
				"status":"success",
				"quantityInCart":cartQuantity
			})
		}
	}catch(err){
		return res.status(500).json({"status":"fail","message":`Server Side Error`})
	}
}
