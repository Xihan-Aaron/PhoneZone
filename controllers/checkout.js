var express = require('express');
var crypto = require('crypto');
const User = require('../models/users');
const PhoneListing = require('../models/phoneListing');


module.exports.checkoutPage = async function(req,res,next){
	try{
		userFromDb = await User.getUserById(req.session.user_id)
		if(userFromDb == null){
			redirect('/')
		}else{
			// result = await helper.getCartInfo(userFromDb.checkout)
			cart = userFromDb.checkout
      cart_final =[]
      var countInvalid=0
      var countQuantityChage=0
      var totalPrice= 0
      var totalQuantity=0
			for(var i = 0;i<cart.length;i++) {
				var item = cart[i]
				var itemInfo = await PhoneListing.getItemById(item.id);
        if(itemInfo!=null ){
          if(cart[i]["quantity"]>itemInfo["stock"]){
            countQuantityChage+=1
            User.editCart(req.session.user_id,item.id,itemInfo["stock"])
            item['title'] = itemInfo['title']
            item['price'] = itemInfo['price']
            item['image'] = itemInfo['image']
            item['quantity'] = itemInfo['stock']
            item['flag']=1
            totalQuantity+=itemInfo['stock']
            totalPrice+=parseFloat(itemInfo['stock']*itemInfo['price'])
						cart_final.push(item)
          }else if(itemInfo["stock"]==0||itemInfo["disabled"]==""){
            countInvalid+=1
            await User.removeFromCart(req.session.user_id,item.id)
          }else{
    				item['title'] = itemInfo['title']
    				item['price'] = itemInfo['price']
    				item['image'] = itemInfo['image']
            item['flag']=0
            totalQuantity+=itemInfo['stock']
            totalPrice+=parseFloat(itemInfo['stock']*itemInfo['price'])
            cart_final.push(item)
          }
        }else{
          countInvalid+=1
          await User.removeFromCart(req.session.user_id,item.id)
        }
			}
			res.render('checkout.ejs',{user_id:req.session.user_id,
        info:cart_final,
        countInvalid:countInvalid,
        countQuantityChage:countQuantityChage,
        totalQuantity:totalQuantity,
        totalPrice:totalPrice
      })
		}
	}catch(err){
		err.statusCode=500
		next(err)
	}
}


module.exports.removeFromCart = async function(req,res,next){
	try{
    var selectedItems = req.body.items;
    var user_id = req.session.user_id;

    for(var i =0; i<selectedItems.length;i++) {
      result = await User.removeFromCart(user_id,selectedItems[i])
    }

		return res.status(200).json({"status":"success"});

	}catch(err){
		return res.status(500).json({"status":"fail","message":`Server Side Error`})
	}
}


module.exports.clearCart = async function(req,res,next){
	try{
    var selectedItems = req.body.selectedItemsQuantity;
    var arrayOfItemId = req.body.items

    var userFromDb = await User.getUserById(req.session.user_id)
    var cart=userFromDb["checkout"]
    updatedCheckout = cart.filter(function(item){
      return arrayOfItemId.indexOf(item.id) === -1;
    })
    for( itemId in selectedItems) {
      quantityBought = selectedItems[itemId]
      await PhoneListing.editStock(itemId,-parseInt(quantityBought))
    }
    var clearCart = {checkout: updatedCheckout}
    await User.updateUser(req.session.user_id,clearCart)
		delete req.session.prevUrl
		delete req.session.prevInfo

    return res.status(200).json({"status":"success"})

	}catch(err){
	  return res.status(500).json({"status":"fail","message":`Server Side Error`})
	}
}
module.exports.changeQuantity = async function(req,res,next){
	try{
    var selectedItem = req.body.items;
    var quantity = req.body.quantity;
    var user_id = req.session.user_id;
    await User.editCart(user_id,selectedItem,quantity)

    return res.status(200).json({
      "status":"success",
  	});

  	}catch(err){
		  return res.status(500).json({"status":"fail","message":`Server Side Error`})
	}
}


module.exports.verifyQuantiy= async function(req,res,next){
  try{
    var phoneInfo = await PhoneListing.getItemById(req.body.item_id)
    var currentQuantity = phoneInfo["stock"]
    if(phoneInfo ==null){
      return res.status(400).json({"status":"fail","message":"The stock has been removed"})
    }
    if(currentQuantity>=parseInt(req.body.quantity)){
      return res.status(200).json({"status":"success"})
    }else{
      return res.status(400).json({"status":"fail","message":`There are only ${currentQuantity} in stock and the you have ordered ${req.body.quantity}! Please wait for restock`})
    }
  }catch(err){
    return res.status(500).json({"status":"fail","message":`Server Side Error`})
  }
}
