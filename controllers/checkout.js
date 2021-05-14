var express = require('express');
var crypto = require('crypto');
const User = require('../models/users');
const PhoneListing = require('../models/phoneListing');


module.exports.checkoutPage = async function(req,res,next){
	console.log(req.session.prevUrl)
	try{
		userFromDb = await User.getUserById(req.session.user_id)
		if(userFromDb == null){
			console.log("redirect");
			redirect('/')
		}else{

			// result = await helper.getCartInfo(userFromDb.checkout)
			cart = userFromDb.checkout
			for(var i = 0;i<cart.length;i++) {
				item = cart[i]
				itemInfo = await PhoneListing.getItemById(item.id);
				item['title'] = itemInfo['title']
				item['price'] = itemInfo['price']
				item['image'] = itemInfo['image']
			}
			res.render('checkout.ejs',{user_id:req.session.user_id,info:cart})
		}
	}catch(err){
		err.statusCode=500
		next(err)
	}
}
module.exports.removeFromCart = async function(req,res,next){
	try{
    selectedItems = req.body.items;
		console.log("items",selectedItems);
    user_id = req.session.user_id;

    for(var i =0; i<selectedItems.length;i++) {
			console.log("i",i,user_id,selectedItems[i]);
      result = await User.removeFromCart(user_id,selectedItems[i])
			console.log("result",result);
    }
		return res.redirect('back');

    // res.json({
  	// 	user_id:req.session.user_id,
  	// 	total:total
  	// });

	}catch(err){
		err.statusCode=500
		next(err)
	}
}
module.exports.clearCart = async function(req,res,next){
	try{
    selectedItems = req.body.items;
    quantity = req.body.quantity;
    for(var i =0; i<selectedItems.length; i++) {
      result1 = await PhoneListing.editStock(selectedItems[i],-parseInt(quantity[i]))
    }
    clearCart = {checkout: []}
    result2 = await User.updateUser(req.session.user_id,clearCart)

    res.redirect('/')

	}catch(err){
		err.statusCode=500
		next(err)
	}
}
module.exports.changeQuantity = async function(req,res,next){
	try{
    selectedItems = req.body.items;
    quantity = req.body.quantity;
    user_id = req.session.user_id;

    error = ""
    for(var i =0; i<selectedItems.length;i++) {
      result1 = await PhoneListing.getItemById(selectedItems[i])
      if(parseInt(result1.stock) > parseFloat(quantity)) {
        result2 = await User.editCart(user_id,selectedItems[i],quantity)
      } else {
        error = "too many, current stock: " + result1.stock
      }
    }
    res.json({
  		user_id:req.session.user_id,
			error:error
  	});


  	}catch(err){
		err.statusCode=500
		next(err)
	}
}
