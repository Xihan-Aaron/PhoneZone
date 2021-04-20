const express= require('express')
const router =express.Router();
const profileController = require('../controllers/profile');
const validation = require('./validation');


router.get('/', profileController.profilePage)

router.post('/editProfile', 
	[
		(req,res,next)=>{
			validation.emailValidation(req,res,next)
		},
		(req,res,next)=>{
			validation.nameValidation(req,res,next)
		}
	],profileController.editProfilePage
)

router.post('/editPassword', profileController.profilePage)


module.exports = router
