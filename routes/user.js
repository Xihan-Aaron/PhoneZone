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
    req.session.destroy(function(err) {
    	if(err){
    		const error = new Error('Server Error. Incorrect User was logged in');
  			error.statusCode = 500;
  			next(error);
    	}
     })
    res.redirect('/');
});

router.post('/forgotPassword', userController.forgotPassword)

router.get('/restPassword/:token', (req,res,next)=>{
	req.session.token=req.params.token
	res.render('forgetPassword.ejs',{errors: []})
})

router.post('/resetPassword',[
	(req,res,next)=>{
		resultValidatePassword = validation.validatePassword(req.body.password.trim())
		resultValidateConfirmPassword = validation.validatePassword(req.body.confirmPassword.trim())
		req.session.errors={}
		req.session.success=true // Set to true so that previous false does not carry forward
		req.session.errors['password']=[]
		req.session.errors['confirmPassword']=[]
		if(resultValidatePassword!==true){
			req.session.success=false
			req.session.errors['password']=resultValidatePassword
		}
		if(resultValidateConfirmPassword!==true){
			req.session.success=false
			req.session.errors['confirmPassword']=resultValidatePassword
		}
		next()
	},
	],userController.resetPassword
)

module.exports = router
