const express= require('express')
const router =express.Router();
const User = require('../models/users');
const userController = require('../controllers/user');
const validation = require('./validation');


router.post('/signup',
	[
		(req,res,next)=>{
			req.session.success=true
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

module.exports = router
