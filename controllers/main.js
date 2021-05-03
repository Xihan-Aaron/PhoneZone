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
		req.session.prevInfo = info
		req.session.prevUrl = 'main'


	}catch(err){
		err.statusCode=500
		next(err)
	}
	res.render('main.ejs',{user_id:req.session.user_id,info:info})
}

module.exports.search = async function(req,res,next){
	try{
		searchtext = req.body.searchtext
		searchResults = await PhoneListing.getMatchingItems(searchtext);
		req.session.prevInfo = searchResults
		req.session.prevUrl = 'search'
		console.log(locals.searchResults)
	}catch(err){
		err.statusCode=500
		next(err)
	}
	// res.render('main.ejs',{user_id:req.session.user_id,searchResults:searchResults})
	res.json({
		user_id:req.session.user_id,
		searchResults:searchResults
	});
}

module.exports.selectItem = async function(req,res,next){
	try{
		item_id = req.body.selectItem
		items = await PhoneListing.getItemById(item_id)
		item = (await helper.extractNames([items]))[0]
		req.session.prevInfo = item
		req.session.prevUrl = 'item'
		// fullname = seller.firstname + seller.lastname
		res.render('main.ejs',{user_id:req.session.user_id, item:item})
	}catch(err){
		err.statusCode=500
		next(err)
	}
}
