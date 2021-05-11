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
	// .elemMatch('checkout',{id:item})
}

UserSchema.statics.addToCart = function(user_id,item){
	return this
	.findByIdAndUpdate({_id:user_id},{$push: {checkout:item}}).exec();
}

UserSchema.statics.editCart = function(user_id,item,quantity){
	return this
	.updateOne(
		{_id:user_id,"checkout.id":item},
		{$inc: {"$checkout.quantity":quantity}}
	)
	.exec();
}

UserSchema.statics.removeFromCart = function(user_id,item){
	return this
	// .findByIdAndUpdate({_id:user_id},{$push: {checkout:item}}).exec();
	.updateOne( {_id:user_id}, { $pullAll: {"checkout.id":item} } )

}

module.exports = mongoose.model('User', UserSchema)
