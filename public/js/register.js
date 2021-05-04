$(document).ready(function(){
    $('#email').on('click', function(e){
        $('#emailError').empty();
    });
    $('#password').on('click', function(e){
        $('#passwordError').empty();
    });

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
                url: "/users/signin"
            }).done(function(data){
                console.log(data)
            })
            // $.post('/users/signin', signinInfo, function(result){
            //     console.log(result);
            // });
        }
    });
});


function checkEmail(email){
    var regexPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regexPattern.test(email); 
}