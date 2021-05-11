$(document).ready(function(){

    $('input[name="email"]').on('focus', function(e){
        $('#emailError').empty();
        $('#serversideError').empty();
    });
    $('input[name="password"]').on('focus', function(e){
        $('#passwordError').empty();
        $('#serversideError').empty();
    });
    
    
    $('#signinBtn').on('click', function(e){
        $('#emailError').empty();
        $('#passwordError').empty();
        $('#serversideError').empty();

        e.preventDefault();
        var signinInfo = {
            email: $('input[name="email"]').val().trim(),
            password: $('input[name="password"]').val().trim()
        }
        if(signinInfo.email == ""){
            $('#emailError').append('<p class="error">- Please enter an email address.</p>');
        }
        if(signinInfo.password == ""){
            $('#passwordError').append('<p class="error">- Please enter a password.</p>');
        }
        if(signinInfo.email != "" && signinInfo.password != ""){
            $.ajax({
                data: signinInfo,
                type: "post",
                url: "/users/signin",
                success: function(result){
                    // var userid = result.user_id;
                    // var tab = result.tab;
                    // console.log(tab);
                    alert(result)
                    history.back(-1);

                },
                error: function(result){
                    // console.log(result.responseJSON);
                    // Array
                    for(var i = 0; i < result.responseJSON.errors.length; i++){
                        $('#serversideError').append('<p class="error">- ' + result.responseJSON.errors[i] + '</p>');
                    }
                }
            });
        }
    });
});