var express = require('express');
var crypto = require('crypto');
const User = require('../models/users');
const PhoneListing = require('../models/phoneListing');


module.exports.main = async function(req,res,next){
	try{

		test = await PhoneListing.getMatchingItems("iphone");
		topFive = await PhoneListing.getTopFive();
		soldOut = await PhoneListing.soldOut();

	}catch(err){
		err.statusCode=500
		next(err)
	}
	res.render('main.ejs',{user_id:req.session.user_id,topFive:topFive,soldOut:soldOut})
}

module.exports.search = async function(req,res,next){
	try{
		console.log("Search")
		searchtext = req.body.searchtext
		searchResults = await PhoneListing.getMatchingItems(searchtext);

	}catch(err){
		err.statusCode=500
		next(err)
	}
	res.render('main.ejs',{user_id:req.session.user_id,searchResults:searchResults})
}

module.exports.selectItem = async function(req,res,next){
	try{
		console.log('selectItem', req.body)
	}catch(err){
		err.statusCode=500
		next(err)
	}
	res.render('main.ejs',{user_id:req.session.user_id})
}
