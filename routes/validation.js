function validateEmailRegex(email){      
   var regexPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
   return regexPattern.test(email); 
 } 

const validatePassword = module.exports.validatePassword = function (password){
 	var onlyText = /^[A-Za-z]*$/;
 	var onlyDigit = /^[0-9]+$/;
 	result = []
 	if(password.length<7){
 		result.push('Please set a password with more than 7 characters');
 	}
 	if(onlyText.test(password)){
 		result.push('Please add numbers or special characters');
 	}
 	if(onlyDigit.test(password)){
 		result.push('Please add letters and special characters')
 	}
 	if(result.length>0){
 		return result
 	}else{
 		return true
 	}
 }

function validateName(name){
 	var onlyText = /^[A-Za-z]*$/;
 	if(name.length==0){
 		return 'can not be empty';
 	}
 	if(onlyText.test(name)==false){
 		return 'can only have letters';
 	}
 	return true;
 }

module.exports.emailValidation=function (req,res,next){
	resultValidateEmail = validateEmailRegex(req.body.email.trim())
	req.session.errors={}
	req.session.errors['email']=[]
	req.session.success=true
	if(resultValidateEmail==false){
		req.session.success=false
		req.session.errors['email'].push('Email is not valid')
	}
	next()
}

module.exports.passwordValidation =function (req,res,next){
	resultValidatePassword = validatePassword(req.body.password.trim())
	req.session.errors['password']=[]
	req.session.errors['confirm_password']=[]
	if(resultValidatePassword!==true){
		req.session.success=false
		req.session.errors['password']=resultValidatePassword
	}
	if(req.body.password.trim()!==req.body.confirm_password.trim()){
		req.session.success=false
		req.session.errors['confirm_password'].push("Please make sure your password matches")
	}
	next()
}

module.exports.nameValidation= function (req,res,next){
	resultValidateLastname = validateName(req.body.lastname.trim())
	resultValidateFirstname = validateName(req.body.firstname.trim())
	req.session.errors['firstname']=[]
	req.session.errors['lastname']=[]
	if(resultValidateLastname!==true){
		req.session.success=false
		req.session.errors['lastname'].push('Last name '+resultValidateLastname)
	}
	if(resultValidateFirstname!==true){
		req.session.success=false
		req.session.errors['firstname'].push('First name '+resultValidateFirstname)		
	}
	next()
}
