$(document).ready(function(){

    $('input[name="firstname"]').on('focus', function(e){
        $('#firstnameError').empty();
        $('#serversideError').empty();
    });
    $('input[name="lastname"]').on('focus', function(e){
        $('#lastnameError').empty();
        $('#serversideError').empty();
    });
    $('input[name="email"]').on('focus', function(e){
        $('#emailError').empty();
        $('#serversideError').empty();
    });
    $('input[name="password"]').on('focus', function(e){
        $('#passwordError').empty();
        $('#serversideError').empty();
    });
    $('input[name="confirm_password"]').on('focus', function(e){
        $('#confirm_passwordError').empty();
        $('#serversideError').empty();
    });
    $(document).keydown(function (event) {
        if ( (event.keyCode || event.which) === 13) {
            $("#signupBtn").click();
        }
    });
    $('#signupBtn').on('click', function(e){
        $('#firstnameError').empty();
        $('#lastnameError').empty();
        $('#emailError').empty();
        $('#passwordError').empty();
        $('#confirm_passwordError').empty();
        e.preventDefault();
        var signupInfo = {
            firstname: $('input[name="firstname"]').val().trim(),
            lastname: $('input[name="lastname"]').val().trim(),
            email: $('input[name="email"]').val().trim(),
            password: $('input[name="password"]').val().trim(),
            confirm_password: $('input[name="confirm_password"]').val()
        }
        if(signupInfo.firstname == ""){
            $('#firstnameError').append('<p class="error">- Please enter a name.</p>');
        }
        if(signupInfo.lastname == ""){
            $('#lastnameError').append('<p class="error">- Please enter a name.</p>');
        }
        if(signupInfo.email == ""){
            $('#emailError').append('<p class="error">- Please enter an email address.</p>');
        }
        if(signupInfo.password == ""){
            $('#passwordError').append('<p class="error">- Please enter a password.</p>');
        }
        if(signupInfo.confirm_password !== signupInfo.password){
            $('#confirm_passwordError').append('<p class="error">- Password does not match.</p>');
        }
        // All field pass.
        if(signupInfo.firstname != "" && signupInfo.lastname != "" && signupInfo.email != "" && signupInfo.password != "" && (signupInfo.confirm_password == signupInfo.password)){
            $.ajax({
                data: signupInfo,
                type: "post",
                url: "/users/signup",
                success: function(result){
                    window.location.href="/"
                    //history.back(-1); - DO NOT USE
                },
                error: function(result){
                    if(result.responseJSON.success == false){
                        for(error in result.responseJSON.errors){
                            if(result.responseJSON.errors[error].length > 0){
                                for(var i = 0; i < result.responseJSON.errors[error].length; i++){
                                    $('#' + error + 'Error').append('<p class="error">- ' + result.responseJSON.errors[error][i] + '</p>');
                                    // $('#serversideError').append('<p class="error">- ' + result.responseJSON.errors[error][i] + '</p>');
                                }
                            }
                        }
                    }
                }
            });
        }
    });

});
