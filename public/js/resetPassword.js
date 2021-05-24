$(document).ready(function(){

    $('input[name="password"]').on('focus', function(e){
        $('#passwordError').empty();
    });

    $('input[name="confirmPassword"]').on('focus', function(e){
        $('#confirmPasswordError').empty();
        $('#token').empty();
    });
    

    $('#resetPasswordBtn').on('click', function(e){
        console.log("hello")
        $('#passwordError').empty();
        $('#confirmPasswordError').empty();
        e.preventDefault();
        var signinInfo = {
            password: $('input[name="password"]').val(),
            confirmPassword: $('input[name="confirmPassword"]').val()

        }
        if(signinInfo.password == ""){
            $('#emailError').append('<p class="error">- Please enter an password.</p>');
        }
        if(signinInfo.confirmPassword == ""){
            $('#passwordError').append('<p class="error">- Please enter a password.</p>');
        }
        if(signinInfo.confirmPassword!=signinInfo.password){
            $('#confirmPasswordError').append('<p class="error">- Please enter matching passwords.</p>');
        }
        if(signinInfo.password != "" && signinInfo.confirmPassword != ""){
            $.ajax({
                data: signinInfo,
                type: "post",
                url: "/users/resetPassword",
                success: function(result){
                    window.location.href="/"
                },
                error: function(result){
                    if( result.responseJSON.errors["confirmPassword"].length>0){
                        for(var i = 0; i < result.responseJSON.errors["confirmPassword"].length; i++){
                            $('#confirmPasswordError').append('<p class="error">- ' + result.responseJSON.errors["confirmPassword"][i] + '</p>');
                        }   
                    }
                    if(result.responseJSON.errors["password"].length>0){
                        for(var i = 0; i < result.responseJSON.errors["password"].length; i++){
                            $('#passwordError').append('<p class="error">- ' + result.responseJSON.errors["password"][i] + '</p>');
                        }    
                    }
                    if(result.responseJSON.errors["token"].length>0){
                        for(var i = 0; i < result.responseJSON.errors["token"].length; i++){
                            $('#confirmPasswordError').append(`<p class="error">- ${result.responseJSON.errors["token"][i]}  <a href="/users/signin">Click here<a/></p>`);
                        }    
                    }
                }
            });
        }
    });
});