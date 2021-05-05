$(document).ready(function(){
    
    $('input[name="firstname"]').on('focus', function(e){
        $('#firstnameError').empty();
        $('#profile-serverError').empty();
    });
    $('input[name="lastname"]').on('focus', function(e){
        $('#lastnameError').empty();
        $('#profile-serverError').empty();
    });
    $('input[name="email"]').on('focus', function(e){
        $('#emailError').empty();
        $('#profile-serverError').empty();
    });
    $('#confirmPassword').on('focus', function(e){
        $('#confirmPasswordError').empty();
        // $('#serversideError').empty();
    });
    $('input[name="currentPassword"]').on('focus', function(e){
        $('#currentPasswordError').empty();
        $('#password-serverError').empty();
    });
    $('input[name="newPassword"]').on('focus', function(e){
        $('#newPasswordError').empty();
        $('#password-serverError').empty();
    });
    $('input[name="title"]').on('focus', function(e){
        $('#titleError').empty();
        $('#newList-serverError').empty();
    });
    $('input[name="brand"]').on('focus', function(e){
        $('#brandError').empty();
        $('#newList-serverError').empty();
    });
    $('input[name="stock"]').on('focus', function(e){
        $('#stockError').empty();
        $('#newList-serverError').empty();
    });
    $('input[name="price"]').on('focus', function(e){
        $('#priceError').empty();
        $('#newList-serverError').empty();
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
        $('#profile-serverError').empty();
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
                url: "/profile/editPassword",
                success: function(result){
                    console.log(result);
                    $('#passwordModal').attr('style', 'display: none;');
                    $('#editProfile').find('input[name="firstname"]').val("");
                    $('#editProfile').find('input[name="lastname"]').val("");
                    $('#editProfile').find('input[name="email"]').val("");

                    // Send profile update
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
                    console.log(result);
                    $('#confirmPasswordError').append('<p class="error">- Incorrect password.</p>');

                }
            });
        }
        


    })

    $('#editPasswordBtn').on('click', function(e){
        $('#password-serverError').empty();
        $('#currentPasswordError').empty();
        $('#newPasswordError').empty();

        e.preventDefault();
        var passwordInfo = {
            currentPassword: $('#editPassword').find('input[name="currentPassword"]').val().trim(),
            newPassword: $('#editPassword').find('input[name="newPassword"]').val().trim()
        }
        if(passwordInfo.currentPassword == ""){
            $('#currentPasswordError').append('<p class="error">- Please enter your previous password.</p>');
        }
        if(passwordInfo.newPassword == ""){
            $('#newPasswordError').append('<p class="error">- Please enter your new password.</p>');
        }
        if((passwordInfo.currentPassword != "") && (passwordInfo.newPassword != "")){
            $.ajax({
                data: passwordInfo,
                type: "post",
                url: "/profile/editPassword",
                success: function(passwordResult){
                    $('#editPassword').find('input[name="currentPassword"]').val("");
                    $('#editPassword').find('input[name="newPassword"]').val("");
                    alert("Password update success.");
                    // console.log(passwordResult);
                },
                error: function(passwordResult){
                    // console.log(passwordResult.responseJSON);
                    if(passwordResult.responseJSON.success == false){
                        for(error in passwordResult.responseJSON.errors){
                            if(passwordResult.responseJSON.errors[error].length > 0){
                                for(var i = 0; i < passwordResult.responseJSON.errors[error].length; i++){
                                    $('#' + error + 'Error').append('<p class="error">- ' + passwordResult.responseJSON.errors[error][i] + '</p>');
                                }
                            }
                        }
                    }
                }
            });
        }
    });

    $('#addNewPhone').on('click', function(e){

        $('#titleError').empty();
        $('#brandError').empty();
        $('#stockError').empty();
        $('#priceError').empty();
        $('#fileError').empty();

        e.preventDefault();
        var title = $('#addNewListing').find('input[name="title"]').val().trim();
        var brand = $('#addNewListing').find('input[name="brand"]').val().trim();
        var stock = parseInt($('#addNewListing').find('input[name="stock"]').val().trim());
        var price = $('#addNewListing').find('input[name="price"]').val().trim();
        var disabled;
        if ($('#disableCheck').prop('checked') == true){
            disabled = 'on';
        } else {
            disabled = 'off';
        }
        var file = $('#addNewListing').find('input[name="productImage"]')[0].files;
        if(file.length < 1){
            $('#fileError').append('<p class="error">- Please choose a product image.</p>');
        }
        var fd = new FormData();
        fd.append('image', file[0]);

        if(title == ""){
            $('#titleError').append('<p class="error">- Please type in a title/description.</p>');
        }
        if(brand == ""){
            $('#brandError').append('<p class="error">- Please type in a brand.</p>');
        }
        if(isNaN(stock)){
            $('#stockError').append('<p class="error">- Please type in the available stock.</p>');
        }
        
        var floatNum = parseFloat(price);
        var priceCheck = true;
        if(isNaN(floatNum) || floatNum < 0){
            $('#priceError').append('<p class="error">- Please enter a positive number.</p>');
            priceCheck = false;
        }
        // var floatTest = /^\\d+(\\.\\d+)?$/;
        // console.log(floatNum);
        // if(floatTest.test(price) == false){
        // }
        var phoneInfo = {
            title: $('#addNewListing').find('input[name="title"]').val().trim(),
            brand: $('#addNewListing').find('input[name="brand"]').val().trim(),
            stock: $('#addNewListing').find('input[name="stock"]').val().trim(),
            price: floatNum,
            image: fd,
            disable: disabled
        }
        console.log(phoneInfo.stock);
        // console.log(phoneInfo.price);
        // if(phoneInfo.title != "" && phoneInfo.brand != "" && phoneInfo.stock != "" )

    });
});