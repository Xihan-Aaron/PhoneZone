$(document).ready(function(){
    
    $('input[name="firstname"]').on('focus', function(e){
        $('#firstnameError').empty();
        $('#searversideError').empty();
    });
    $('input[name="lastname"]').on('focus', function(e){
        $('#lastnameError').empty();
        $('#searversideError').empty();
    });
    $('input[name="email"]').on('focus', function(e){
        $('#emailError').empty();
        $('#searversideError').empty();
    });
    $('input[name="password"]').on('focus', function(e){
        $('#passwordError').empty();
        $('#password1Error').empty();
        $('#searversideError').empty();
    });
    $('input[name="confirm_password"]').on('focus', function(e){
        $('#password2Error').empty();
        $('#searversideError').empty();
    });
    
    // $('#password').on('click', function(e){
    //     $('#passwordError').empty();
    // });


    $('#signinBtn').on('click', function(e){
        $('#emailError').empty();
        $('#passwordError').empty();

        e.preventDefault();
        var signinInfo = {
            email: $('input[name="email"]').val().trim(),
            password: $('input[name="password"]').val().trim()
        }
        if(signinInfo.email != ""){
            if (!checkEmail(signinInfo.email)){
                $('#emailError').append('<p class="error">- Please enter a valid email address.</p>');
            }
        } else {
            $('#emailError').append('<p class="error">- Please enter an email address.</p>');
        }
        if(signinInfo.password == ""){
            $('#passwordError').append('<p class="error">- Please enter a password.</p>');
        }
        if(checkEmail(signinInfo.email) && signinInfo.password != ""){
            $.ajax({
                data: signinInfo,
                type: "post",
                url: "/users/signin",
                success: function(result){
                    // var userid = result.user_id;
                    // var tab = result.tab;
                    // console.log(tab);
                    history.back(-1);

                },
                error: function(result){
                    // console.log(result.responseJSON);
                    $('#emailError').append('<p class="error">- ' + result.responseJSON.errors[0] + '</p>');
                }
            });
        }
    });
    $('#signupBtn').on('click', function(e){
        $('#firstnameError').empty();
        $('#lastnameError').empty();
        $('#emailError').empty();
        $('#password1Error').empty();
        $('#password2Error').empty();
        e.preventDefault();
        var signupInfo = {
            firstname: $('input[name="firstname"]').val().trim(),
            lastname: $('input[name="lastname"]').val().trim(),
            email: $('input[name="email"]').val().trim(),
            password: $('input[name="password"]').val().trim(),
            confirm_password: $('input[name="confirm_password"]').val().trim()
        }
        // console.log(signupInfo);
        if(signupInfo.firstname != ""){
            if(checkName(signupInfo.firstname) !== true){
                $('#firstnameError').append('<p class="error">- ' + checkName(signupInfo.firstname) + '</p>');
            }
        } else {
            $('#firstnameError').append('<p class="error">- Please enter a name.</p>');
        }
        if(signupInfo.lastname != ""){
            if(checkName(signupInfo.lastname) !== true){
                $('#lastnameError').append('<p class="error">- ' + checkName(signupInfo.lastname) + '</p>');
            }
        } else {
            $('#lastnameError').append('<p class="error">- Please enter a name.</p>');
        }
        if(signupInfo.email != ""){
            if (checkEmail(signupInfo.email) !== true){
                $('#emailError').append('<p class="error">- Please enter a valid email address.</p>');
            }
        } else {
            $('#emailError').append('<p class="error">- Please enter an email address.</p>');
        }
        if(signupInfo.password != ""){
            var passwordCheck = checkpassword(signupInfo.password);
            if(passwordCheck !== true){
                for (var i = 0; i < passwordCheck.length; i++){
                    $('#password1Error').append('<p class="error">- ' + passwordCheck[i] + '</p>');
                }
            }
        } else {
            $('#password1Error').append('<p class="error">- Please enter a password.</p>');
        }
        if(signupInfo.confirm_password !== signupInfo.password){
            $('#password2Error').append('<p class="error">- Password does not match.</p>');
        }
        // All field pass.
        if(checkName(signupInfo.firstname) && checkName(signupInfo.lastname) && checkEmail(signupInfo.email) && checkpassword(signupInfo.password) && (signupInfo.confirm_password == signupInfo.password)){
            $.ajax({
                data: signupInfo,
                type: "post",
                url: "/users/signup",
                success: function(result){
                    history.back(-1);
                },
                error: function(result){
                    // console.log(result.responseJSON);
                    if(result.responseJSON.success == false){
                        for(error in result.responseJSON.errors){
                            if(result.responseJSON.errors[error].length > 0){
                                for(var i = 0; i < result.responseJSON.errors[error].length; i++){
                                    $('#searversideError').append('<p class="error">- ' + result.responseJSON.errors[error][i] + '</p>');
                                }
                            }
                        }
                    }
                }
            });
        }
    });
});


function checkEmail(email){
    var regexPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regexPattern.test(email); 
}

function checkName(name){
    var onlyText = /^[a-zA-Z]+$/;
    // var onlyText = /^[A-Za-z]*$/;
    if(name.length==0){
        return 'Name can not be empty.';
    }
    if(onlyText.test(name)==false){
        return 'Name can only have letters.';
    }
    return true;
}

function checkpassword(password){
    var onlyText = /^[a-zA-Z]+$/;
 	var onlyDigit = /^[0-9]+$/;
 	result = []
 	if(password.length<7){
 		result.push('Please set a password with more than 7 characters.');
 	}
 	if(onlyText.test(password)){
 		result.push('Please add numbers or special characters.');
 	}
 	if(onlyDigit.test(password)){
 		result.push('Please add letters and special characters.')
 	}
 	if(result.length>0){
 		return result
 	}else{
 		return true
 	}
}