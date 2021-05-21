const express= require('express')
const router =express.Router();
const profileController = require('../controllers/profile');
const validation = require('./validation');
const multer = require('multer')
const path = require('path');

const storage =multer.diskStorage({
	destination: function(req,file,cb){
		cb(null, 'public/images/phone_default_images')
	},
	filename: function(req,file,cb){
		cb(null, req.body.brand+'_'+req.session.user_id+'_'+Date.now()+path.extname(file.originalname))
	}
})

const fileFilter = function(req,file,cb){
	if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
		cb(null, true)
	}else{
		cb(new Error('Wrong extension type'),false)
	}
}

const upload = multer({
	storage:storage,
	limits:{fileSize:1024*1024*5},
	fileFilter:fileFilter

})
router.get('/', profileController.profilePage)


router.post('/editProfile',
	[
		(req,res,next)=>{
			req.session.success=true
			req.session.errors={}
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
			fieldsToValidate=[]
			lastNameObject = {}
			lastNameObject['field']='lastname'
			lastNameObject['body']=req.body.lastname
			lastNameObject['properName']='Last Name'
			fieldsToValidate.push(lastNameObject)
			firstnameObject = {}
			firstnameObject['field']='firstname'
			firstnameObject['body']=req.body.firstname
			firstnameObject['properName']='First Name'
			fieldsToValidate.push(firstnameObject)
			validation.nameValidation(fieldsToValidate,req,res,next)
		}
	],profileController.editProfilePage
)


router.post('/checkPassword',profileController.checkPassword)

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


router.post('/addNewListing'
	,(req,res,next)=>{
		req.session.success=true
		req.session.errors={}
		upload.single('productImage')(req,res,function (err){
			if(err) {
		    	req.session.errors['file']=[]
		     	req.session.errors['file'].push(err.message)
		      	req.session.success=false
		    }
			fieldsToValidate=[]

			brandObject = {}
			brandObject['field']='brand'
			brandObject['body']=req.body.brand
			brandObject['properName']='Brand'

			fieldsToValidate.push(brandObject)
			validation.nameValidation(fieldsToValidate,req,res,next)
		})
	}
	,profileController.addNewListing)



router.post('/removeListing'
	,(req,res,next)=>{
		req.session.success=true
		req.session.errors={}
		next()
	}
	,profileController.removeListing)


router.put('/editListing'
	,(req,res,next)=>{
		req.session.success=true
		req.session.errors={}
		next()
	}
	,profileController.editListing)
module.exports = router
