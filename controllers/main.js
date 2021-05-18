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
		console.log(req.session)
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
		item_max_quantity = parseInt(req.body.maxQuantity)
		console.log(req.body.price);
		item_price = parseFloat(req.body.price)

		user_id = req.session.user_id
		userFromDb = await User.getUserById(user_id)
		console.log("userFromDb: ",userFromDb);
		if(userFromDb == null) {
			return res.status(400).json({"status":"fail","message":"Please sign in before adding to Cart","type":"signin"})
		}
		itemInfo =userFromDb["checkout"].filter(function(item){
			return item['id']==item_id
		})
		console.log(itemInfo,"info")
		if(itemInfo.length>0) {
			currentQuantity =parseInt(itemInfo[0]["quantity"])
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
			console.log(itemToAdd);
			var item = await User.addToCart(user_id,itemToAdd)
		}
		return res.status(200).json({"status":"success"})
	}catch(err){
		return res.status(500).json({"status":"fail","message":`Server Side Error`})
	}
}

module.exports.getCartInfo = async function(req,res,next){
	try{
		user_id = req.session.user_id
		userFromDb = await User.getUserById(user_id)
		if(userFromDb == null) {
			return res.status(500).json({"status":"fail","message":`Unable to find user`})
		}else{
			checkout = userFromDb["checkout"]
			cartQuantity =0
			cartPrice= 0
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
		user_id = req.session.user_id
		item_id = req.body.item

		userFromDb = await User.getUserById(user_id)
		if(userFromDb == null) {
			return res.status(500).json({"status":"fail","message":`Unable to find user`})
		}else{
			cartQuantity = (await User.getQuantityInCart(user_id,item_id))[0]
			return res.status(200).json({
				"status":"success",
				"quantityInCart":cartQuantity.checkout[0].quantity
			})
		}
	}catch(err){
		return res.status(500).json({"status":"fail","message":`Server Side Error`})
	}
}
