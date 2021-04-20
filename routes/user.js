const express= require('express')
const router =express.Router();
const User = require('../models/users');
const userController = require('../controllers/user');
const validation = require('./validation');


router.post('/signup',
	[
		(req,res,next)=>{
			validation.emailValidation(req,res,next)
		},
		(req,res,next)=>{
			validation.passwordValidation(req,res,next)
		},
		(req,res,next)=>{
			validation.nameValidation(req,res,next)
		}
	],userController.signup	
)

router.post('/signin',userController.signin)

router.get('/signup', (req,res,next)=>{
	res.render('signup.ejs',{errors: {}})
})

router.get('/signin', (req,res,next)=>{
	res.render('signin.ejs',{errors: []})
})


module.exports = router
