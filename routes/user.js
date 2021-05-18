const express= require('express')
const router =express.Router();
const User = require('../models/users');
const userController = require('../controllers/user');
const validation = require('./validation');


router.post('/signup',
	[
		(req,res,next)=>{
			req.session.success=true
			req.session.errors={}
			validation.emailValidation(req,res,next)
		},
		(req,res,next)=>{
			validation.passwordValidation(req,res,next)
		},
		(req,res,next)=>{
			namesToValidate=[]
			lastNameObject = {}
			lastNameObject['field']='lastname'
			lastNameObject['body']=req.body.lastname
			lastNameObject['properName']='Last Name'
			namesToValidate.push(lastNameObject)
			firstnameObject = {}
			firstnameObject['field']='firstname'
			firstnameObject['body']=req.body.firstname
			firstnameObject['properName']='First Name'
			namesToValidate.push(firstnameObject)
			validation.nameValidation(namesToValidate,req,res,next)
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

router.get('/signout', (req,res,next)=>{
	console.log("hello")
    req.session.destroy(function(err) {
    	if(err){
    		const error = new Error('Server Error. Incorrect User was logged in');
  			error.statusCode = 500;
  			next(error);
    	}
     })
    res.redirect('/');
});

module.exports = router
