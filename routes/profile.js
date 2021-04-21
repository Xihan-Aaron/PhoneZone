const express= require('express')
const router =express.Router();
const profileController = require('../controllers/profile');
const validation = require('./validation');


router.get('/', profileController.profilePage)

router.post('/editProfile', 
	[
		(req,res,next)=>{
			req.session.success=true
			editAttributes = {}
			if(req.body.email.length>0){
				editAttributes["email"]=req.body.email
			}
			if(req.body.firstname.length>0){
				editAttributes["firstname"]=req.body.firstname
			}
			if(req.body.lastname.length>0){
				editAttributes["lastname"]=req.body.lastname
			}
			req.session.editAttributes=editAttributes
			next()
		},
		(req,res,next)=>{
			validation.emailValidation(req,res,next)
		},
		(req,res,next)=>{
			validation.nameValidation(req,res,next)
		}
	],profileController.editProfilePage
)

router.post('/editPassword',
	(req,res,next)=>{
		resultValidatePassword = validation.validatePassword(req.body.newPassword.trim())
		req.session.errors={}
		req.session.success=true // Set to true so that previous false does not carry forward
		req.session.errors['newPassword']=[]
		if(resultValidatePassword!==true){
			req.session.success=false
			req.session.errors['newPassword']=resultValidatePassword
		}
		next()
	}
,profileController.editPassword)


module.exports = router
