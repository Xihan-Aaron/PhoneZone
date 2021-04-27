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
	console.log(user_id,updateInfo)
	return this
	.findByIdAndUpdate ({_id:user_id},updateInfo,{new:true})
	.exec()
}

UserSchema.statics.getUserNameById = function(user_id){
	return this
		.findById(user_id)
		.aggregate (
			[
				{$project: {fullName: { $concat: ["$firstname", " ", "$lastname"]}}}
			]
		)
}

module.exports = mongoose.model('User', UserSchema)
