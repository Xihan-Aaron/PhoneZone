var express = require('express');
var crypto = require('crypto');
const User = require('../models/users');
const PhoneListing = require('../models/phoneListing');
const helper = require('./helper');


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
		item_id = req.body.selectItem
		console.log('selectItem', item_id)
		items = await PhoneListing.getItemById(item_id)
		item = (await helper.extractNames([items]))[0]
		console.log("item", item);
		// fullname = seller.firstname + seller.lastname
		res.render('main.ejs',{user_id:req.session.user_id, item:item})
	}catch(err){
		err.statusCode=500
		next(err)
	}
}
