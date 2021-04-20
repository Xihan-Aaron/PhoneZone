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
		trim:true
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
	}
})

const User = module.exports = mongoose.model('User', UserSchema)

module.exports.getUserById = function(id){
	return User.findById(id)
}
module.exports.getUserByEmail = function(email){
	return User.findOne({email:email})
}

module.exports.addUser = function(newUser){
	newUser.save()
	return newUser
}

module.exports.updateUser = function(user_id,updateInfo){
	User.updateOne({id:user_id},{$set: updateInfo})
}