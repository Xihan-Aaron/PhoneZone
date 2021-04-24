var express = require('express');
var crypto = require('crypto');
const User = require('../models/users');
const PhoneListing = require('../models/phoneListing');


module.exports.main = async function(req,res,next){
	try{
		topFive = await PhoneListing.getTopFive()
		soldOut = await PhoneListing.soldOut()
		all = await PhoneListing.all()
		console.log("topFive", topFive)
		console.log("soldOut", soldOut)
		
		
	}catch(err){
		err.statusCode=500
		next(err)
	}
	res.render('main.ejs',{user_id:req.session.user_id})
}