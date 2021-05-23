const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const config = require('../config/database')

//User Schema
const UserSchema = mongoose.Schema({
	firstname:{
		type:String,
		trim:true
	},
	email:{
		type:String,
		lowercase:true,
		required: true,
		trim:true,
		unique : true,
	},
	lastname:{
		type:String,
		required: true,
		trim:true
	},
	password:{
		type:String,
		required: true,
		trim:true
	},
	checkout:{
		type:Array
	},
	resetLink:{
		type:String,
		trim:true
	}
}
, {collection:"users"})


UserSchema.statics.getUserById = function(user_id){
	return this
		.findById(user_id)
}

UserSchema.statics.getUserByEmail = function(email){
	return this
		.findOne({email:email})
}

UserSchema.statics.addUser = function(newUser){
	newUser.save()
	return newUser
}

UserSchema.statics.updateUser = function(user_id,updateInfo){
	return this
	.findByIdAndUpdate ({_id:user_id},updateInfo,{new:true})
	.exec()
}

UserSchema.statics.checkExisting = function(user_id,item){
	return this
	.findOne({_id:user_id,"checkout.id":item})
}

UserSchema.statics.addToCart = function(user_id,item){
	return this
	.findByIdAndUpdate({_id:user_id},{$push: {checkout:item}}).exec();
}

UserSchema.statics.addExistingToCart = function(user_id,item,quantity){
	return this
	.updateOne(
		{_id:user_id,"checkout.id":item},
		{$inc: {"checkout.$.quantity":parseInt(quantity)}}
	)
	.exec();
}

UserSchema.statics.editCart = function(user_id,item,quantity){
	return this
	.updateOne(
		{_id:user_id,"checkout.id":item},
		{$set: {"checkout.$.quantity":parseInt(quantity)}
	}
	)
	.exec();
}

UserSchema.statics.getQuantityInCart = function(user_id,item_id){
	return this
		.find(
			{_id:user_id},
			{_id:0,checkout:{$elemMatch: {id:item_id}}}
		)
}

UserSchema.statics.removeFromCart = function(user_id,item){
	return this
	.findByIdAndUpdate(user_id,
	{$pull: {checkout:{id:item}}},
	{safe:true, upsert:true},
	function(err, doc) {
        if(err){
        console.log(err);
        }else{
				console.log("user_id",user_id);
				console.log("item: ",item);
				}
			}
		).exec()
}

UserSchema.statics.getCartInfo = function(user_id){
	return this.aggregate(
		[
			{$match:{_id:user_id}},
			{$project:{"_id":0,cartQuantity:{"$sum": {
              "$map": {
                  "input": "$checkout",
                  "as": "checkout",
                  "in": { "$sum": [ "$$checkout.quantity"
                    ]
									}
                }
            }},
			cartPrice: {
				"$sum": {
					"$map": {
						"input": "$checkout",
						"as": "checkout",
						"in": { "$multiply": [
							{ "$ifNull": [ "$$checkout.quantity", 0 ] },
							{ "$ifNull": [ "$$checkout.price", 0 ] }
						]}
					}
				}
			}}}
		]
	)
}

module.exports = mongoose.model('User', UserSchema)
