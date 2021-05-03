const mongoose = require('mongoose')
const config = require('../config/database')
var objectId = require('mongodb').ObjectID;

//PhoneListing Schema
const PhoneListingSchema = mongoose.Schema({
	title:{
		type:String,
		trim:true,
		required: true,
	},
	brand:{
		type:String,
		trim:true,
		required: true
	},
	image:{
		type:String,
		trim:true,
	},
	stock:{
		type:Number,
		default:0
	},
	seller:{
		type:String,
		trim:true,
	},
	price:{
		type:Number,
		default:0
	},
	disabled:{
		type:String,
	},
	reviews:{
		type:Array,
	}
}
, {collection:"phoneListing"})


PhoneListingSchema.statics.getMatchingItems = function(search){
	return this
		.find({
				title: {$regex: search,$options: 'i'},
				disabled:null
		})
}

PhoneListingSchema.statics.getItemsBySeller = function(user_id){
	return this
		.find({
				seller: user_id
		})
}

PhoneListingSchema.statics.updateDisabled = function(id,disabled){
	if(disabled){
		return this.updateOne(
		    {"_id" :  new objectId(id)},
		    {$set: { "disabled" : ""}}
		)	
	}else{
		return this.updateOne(
		    {"_id" :  new objectId(id)},
		    {$unset: { "disabled" : ""}}
		)
	}
}

PhoneListingSchema.statics.addNewListing=function(newListing){
	newListing.save()
	return newListing;
}	

PhoneListingSchema.statics.removeListingById=function(listingId){
	return this.deleteOne({"_id": new objectId(listingId)})
}

PhoneListingSchema.statics.getItemByTitleBrand = function(titleName,brandName){
	return this
		.find({
			title: titleName.trim(),
			brand: brandName.trim()
		})

}

PhoneListingSchema.statics.getItemById = function(item_id){
	return this
		.findById(item_id)
}


PhoneListingSchema.statics.getTopFive = function(){
	return this
		.aggregate(
		    [
			    {$match:{
			        "reviews":{$elemMatch:{"rating":{$exists:true}}},
			        disabled:null
			        }
			    },
			    {$project:{"_id":1,image:1,price:1,avgReviews:{$avg:"$reviews.rating"},numReviews:{$size:"$reviews"}}},
			    {$match:{"numReviews":{$gte:2}}},
			    {$limit:5},
			    {$sort:{"avgReviews":-1,}}
		    ]
		)
}

PhoneListingSchema.statics.soldOut = function(){
	return this
		.find({
		    disabled:null,
		    stock:{$gte:1}
		})
		.sort({stock:1})
		.limit(5)
}

PhoneListingSchema.statics.all = function(){
	return this
		.find({})
		.countDocuments()

}
module.exports = mongoose.model('PhoneListing', PhoneListingSchema)
