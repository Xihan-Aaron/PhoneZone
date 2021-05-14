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
    $('input[name="productImage"]').on('focus', function(e){
        $('#fileError').empty();
        $('#newList-serverError').empty();
    });
    $('#phoneListBody').on('click', function(e){
        $('#modifyListError').empty();
    })

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
                data: {password:password},
                type: "post",
                url: "/profile/checkPassword",
                success: function(result){
                    $('#passwordModal').modal('hide');

                    // Send profile update
                    $.ajax({
                        data: editInfo,
                        type: "post",
                        url: "/profile/editProfile",
                        success: function(updateResult){
                            if(updateResult.success == false){
                                for(error in updateResult.errors){
                                    $('#profile-serverError').append('<p class="error">- ' + updateResult.errors[error] + '</p>');
                                }
                            } else {
                                // alert("Update success");
                                $('#editProfile').find('input[name="firstname"]').val("");
                                $('#editProfile').find('input[name="lastname"]').val("");
                                $('#editProfile').find('input[name="email"]').val("");
                                if(editInfo.firstname != ''){
                                    $('#editProfile').find('input[name="firstname"]').attr('placeholder', editInfo.firstname);
                                    $('#basicInfo').find('input[name="firstname"]').attr('value', editInfo.firstname);
                                }
                                if(editInfo.lastname != ''){
                                    $('#editProfile').find('input[name="lastname"]').attr('placeholder', editInfo.lastname);
                                    $('#basicInfo').find('input[name="lastname"]').attr('value', editInfo.lastname);
                                }
                                if(editInfo.email != ''){
                                    $('#editProfile').find('input[name="email"]').attr('placeholder', editInfo.email);
                                    $('#basicInfo').find('input[name="email"]').attr('value', editInfo.email);

                                }
                            }
                        },
                        error: function(updateResult){
                            if(updateResult.success == false){
                                for(error in updateResult.errors){
                                    $('#profile-serverError').append('<p class="error">- ' + updateResult.errors[error] + '</p>');
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
    });

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
                    history.go(0)
                    // alert("Password update success.");
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
        console.log(disabled);
        var files = $('#addNewListing').find('input[name="productImage"]')[0].files;
        if(files.length < 1){
            $('#fileError').append('<p class="error">- Please choose a product image.</p>');
        }
        var file = files[0];

        if(title == ""){
            $('#titleError').append('<p class="error">- Please type in a title/description.</p>');
        }
        if(brand == ""){
            $('#brandError').append('<p class="error">- Please type in a brand.</p>');
        }
        if(isNaN(stock) || stock < 0){
            $('#stockError').append('<p class="error">- Please type in a valid stock number.</p>');
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
            title: title,
            brand: brand,
            stock: stock,
            price: floatNum,
            productImage: file,
            disable: disabled
        }
        var formData = new FormData();
        $.each(phoneInfo, function(key, value){
            formData.append(key, value);
        })
        
        console.log(phoneInfo.stock);
        // console.log(phoneInfo.price);
        // if(phoneInfo.title != "" && phoneInfo.brand != "" && phoneInfo.stock != "" )
        if(title != "" && brand != "" && !isNaN(stock) && !(stock < 0) && !isNaN(floatNum) && floatNum >= 0 && files.length > 0){
            $.ajax({
                data: formData,
                type: "post",
                url: "/profile/addNewListing",
                processData: false,
                contentType: false,
                success: function(result){
                    // console.log("success");
                    console.log(result);
                    history.go(0);
                    // window.location.href = '/profile';
                },
                error: function(result){
                    // console.log("error");
                    // console.log(result);
                    if(result.responseJSON.success == false){
                        for(error in result.responseJSON.errors){
                            if(error == 'server'){
                                $('#newList-serverError').append('<p class="error">- ' + result.responseJSON.errors[error][0] + '</p>');
                            }
                            if(result.responseJSON.errors[error].length > 0){
                                for(var i = 0; i < result.responseJSON.errors[error].length; i++){
                                    $('#' + error + 'Error').append('<p class="error">- ' + result.responseJSON.errors[error][i] + '</p>');

                                }
                            }
                        }
                    }
                }
            })
        }
    });

    $('.disableBtn').on('click', function(e){
        $('#modifyListError').empty();
        e.preventDefault();

        var id = $(this).parent().parent().parent().prop('id');
        var disableDivHTML = $(this).parent().parent().parent().find('.disabled').html();
        console.log(disableDivHTML);
        
        var disable;
        if(disableDivHTML.indexOf('Disable') > -1){
            disable = false;
        } else {
            disable = true;
        }
        var disableInfo = {
            editId: id,
            disabled: disable
        }
        $.ajax({
            data: disableInfo,
            type: "put",
            url: "/profile/editListing",
            success: function(result){
                console.log(result);
                // alert("Disabled successfully.");
                history.go(0);
                // disableDiv.html('<del>Disabled</del>');
            },
            error: function(result){
                for(error in result.responseJSON.errors){
                    if(error == 'item'){
                        for(var i = 0; i < result.responseJSON.errors[error].length; i++){
                            $('#modifyListError').append('<p class="error">- ' + result.responseJSON.errors['item'][i] + '</p>');
                        }
                    } else {
                        for(var i = 0; i < result.responseJSON.errors[error].length; i++){
                            $('#modifyListError').append('<p class="error">- ' + result.responseJSON.errors['item'][i] + '</p>');
                        }
                    }
                }
                // for(var i = 0; i < result.responseJSON.errors['item'].length; i++){
                //     $('#modifyListError').append('<p class="error">- ' + result.responseJSON.errors['item'][i] + '</p>');
                // }
            }
        })
    });

    $('.removeBtn').on('click', function(e){
        $('#modifyListError').empty();
        e.preventDefault();

        var id = $(this).parent().parent().parent().prop('id');
        var itemRow = $(this).parent().parent().parent();
        $.ajax({
            data: {removeId: id},
            type: "post",
            url: "/profile/removeListing",
            success: function(result){
                console.log(result);
                alert("Remove successfully.");
                itemRow.remove();
            },
            error: function(result){
                console.log(result.responseJSON);
                for(error in result.responseJSON.errors){
                    if(error == 'item'){
                        for(var i = 0; i < result.responseJSON.errors[error].length; i++){
                            $('#modifyListError').append('<p class="error">- ' + result.responseJSON.errors['item'][i] + '</p>');
                        }
                    } else {
                        for(var i = 0; i < result.responseJSON.errors[error].length; i++){
                            $('#modifyListError').append('<p class="error">- ' + result.responseJSON.errors['item'][i] + '</p>');
                        }
                    }
                }
            }
        })
    });

    $('#confirmsignoutBtn').on('click', function(e){
        console.log('here')
        e.preventDefault();
        $('#signoutModal').modal('hide');
        window.location.href = '/users/signout';
      });
});