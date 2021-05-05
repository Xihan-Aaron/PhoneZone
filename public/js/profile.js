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
    $('#confirmPassword').on('focus', function(e){
        $('#confirmPasswordError').empty();
        $('#serversideError').empty();
    });
    $('input[name="currentPassword"]').on('focus', function(e){
        $('#password1Error').empty();
        $('#serversideError').empty();
    });
    $('input[name="newPassword"]').on('focus', function(e){
        $('#password2Error').empty();
        $('#serversideError').empty();
    });

    // $('#editProfileBtn').on('click', function(e){
    //     $('#firstnameError').empty();
    //     $('#lastnameError').empty();
    //     $('#emailError').empty();
    //     e.preventDefault();
    //     // var editInfo = {
    //     //     firstname: $('#editProfile').find('input[name="firstname"]').val().trim(),
    //     //     lastname: $('#editProfile').find('input[name="lastname"]').val().trim(),
    //     //     email: $('#editProfile').find('input[name="email"]').val().trim()
    //     // }

    //     // if(editInfo.firstname == ""){
    //     //     $('#firstnameError').append('<p class="error">- Please enter a name.</p>');
    //     // }
    // })



    $('#confirmPasswordBtn').on('click', function(e){
        $('#firstnameError').empty();
        $('#lastnameError').empty();
        $('#emailError').empty();
        $('#edit-serverError').empty();
        e.preventDefault();
        var editInfo = {
            firstname: $('#editProfile').find('input[name="firstname"]').val().trim(),
            lastname: $('#editProfile').find('input[name="lastname"]').val().trim(),
            email: $('#editProfile').find('input[name="email"]').val().trim()
        }

        
        // Check password
        var password = $('#confirmPassword').val().trim();
        if(password == ""){
            $('#confirmPasswordError').append('<p class="error">- Please enter your password to continue.</p>');
        } else {
            $.ajax({
                data: password,
                type: "post",
                url: "...checkPassword...maybe",
                success: function(result){
                    $('#passwordModal').attr('style', 'display: none;');
                    $('#editProfile').find('input[name="firstname"]').empty();
                    $('#editProfile').find('input[name="lastname"]').empty();
                    $('#editProfile').find('input[name="email"]').empty();

                    $.ajax({
                        data: editInfo,
                        type: "post",
                        url: "/profile/editProfile",
                        success: function(updateResult){
                            // console.log(result);
                            if(updateResult.success == false){
                                for(error in updateResult.errors){
                                    $('#edit-serverError').append('<p class="error">- ' + updateResult.errors[error] + '</p>');
                                }
                            } else {
                                alert("Update success");
                                // console.log($('#editProfile').find('input[name="firstname"]'));
                                // $('#editProfile').find('input[name="lastname"]').empty();
                                // $('#editProfile').find('input[name="email"]').empty();
                            }
                        },
                        error: function(updateResult){
                            console.log(updateResult);
                            if(updateResult.success == false){
                                for(error in updateResult.errors){
                                    $('#edit-serverError').append('<p class="error">- ' + updateResult.errors[error] + '</p>');
                                }
                            }
                        }
                    });

                },
                error: function(result){
                    $('#confirmPasswordError').append('<p class="error">- Incorrect password.</p>');

                }
            });
        }
        


    })
});