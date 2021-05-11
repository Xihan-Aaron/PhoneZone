var express = require('express');
var crypto = require('crypto');
const User = require('../models/users');
const PhoneListing = require('../models/phoneListing');


module.exports.checkoutPage = async function(req,res,next){
	try{
		userFromDb = await User.getUserById(req.session.user_id)
		console.log("userinfo:",userFromDb);
		if(userFromDb == null){
			redirect('/')
		}else{
			console.log("checkout: ",userFromDb.checkout);

			// result = await helper.getCartInfo(userFromDb.checkout)
			cart = userFromDb.checkout
			totalPrice = 0;
			for(var i = 0;i<cart.length;i++) {
				console.log(i,":",cart[i]);
				item = cart[i]
				itemInfo = await PhoneListing.getItemById(item.id);
				item['title'] = itemInfo['title']
				item['price'] = itemInfo['price']
				item['image'] = itemInfo['image']
				totalPrice += (parseFloat(itemInfo['price'])*item['quantity'])
			}
			console.log("cart",cart);
			res.render('checkout.ejs',{user_id:req.session.user_id,info:cart,total:totalPrice})
		}
	}catch(err){
		err.statusCode=500
		next(err)
	}
}
