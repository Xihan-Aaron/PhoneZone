$(document).ready(function(){

    var modalBox = $('#modalCommon')
    var modalTitle = $('#modalCommonTitle')
    var modalBody = $('#modalCommonBody')
    modalBody.attr("style", "padding: 15px;")
    var modalFooter = $('#modalCommonFooter')

    function closeModal(){
        modalTitle.text()
        modalBody.attr("style", "padding: 15px;")
        modalBody.html('')
        modalFooter.html('')
        modalBox.css("display", "none")
    }
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
        var password = $('#confirmPassword').val();
        if(password == ""){
            $('#confirmPasswordError').append('<p class="error">- Please enter your password to continue.</p>');
        } else {
            $.ajax({
                data: {password:password},
                type: "post",
                url: "/profile/checkPassword",
                success: function(result){
                    $('#passwordModal').modal('hide');
                    e.preventDefault();

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
                          console.log(updateResult);
                            if(updateResult['responseJSON'].success == false){
                                for(error in updateResult['responseJSON'].errors){
                                    $('#profile-serverError').append('<p class="error">- ' + updateResult['responseJSON'].errors[error] + '</p>');
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
    });

    $('#editPasswordBtn').on('click', function(e){
        $('#password-serverError').empty();
        $('#currentPasswordError').empty();
        $('#newPasswordError').empty();

        e.preventDefault();
        var passwordInfo = {
            currentPassword: $('#editPassword').find('input[name="currentPassword"]').val(),
            newPassword: $('#editPassword').find('input[name="newPassword"]').val()
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
                },
                error: function(passwordResult){
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
        var files = $('#addNewListing').find('input[name="productImage"]')[0].files;
        var fileCheck = true;
        var file;
        if(files.length < 1){
            $('#fileError').append('<p class="error">- Please choose a product image.</p>');
            fileCheck = false;
        } else {
            file = files[0];
            var filename = file.name;
            var temp = filename.split('.');
            // Check for file extension
            temp = temp[temp.length - 1];
            if ('jpg' != temp && 'jpeg' != temp && 'png' != temp){
                fileCheck = false;
                $('#fileError').append('<p class="error">- Please choose a valid image file.</p>');
            }
        }

        if(title == ""){
            $('#titleError').append('<p class="error">- Please type in a title/description.</p>');
        }
        if(brand == ""){
            $('#brandError').append('<p class="error">- Please type in a brand.</p>');
        }
        var stockCheck = true;
        if(isNaN(stock) || stock < 0){
            stockCheck = false;
            $('#stockError').append('<p class="error">- Please type in a valid stock number.</p>');
        }

        if ($('#disableCheck').prop('checked') == true || stock == 0){
            disabled = 'on';
        } else {
            disabled = 'off';
        }
        var floatNum = parseFloat(price);
        var priceCheck = true;
        if(isNaN(floatNum) || floatNum < 0){
            $('#priceError').append('<p class="error">- Please enter a positive number.</p>');
            priceCheck = false;
        }

        var phoneInfo = {
            title: title,
            brand: brand,
            stock: stock,
            price: floatNum,
            productImage: file,
            disabled: disabled
        }
        var formData = new FormData();
        $.each(phoneInfo, function(key, value){
            formData.append(key, value);
        })


        if(title != "" && brand != "" && stockCheck && priceCheck && fileCheck){
            $.ajax({
                data: formData,
                type: "post",
                url: "/profile/addNewListing",
                processData: false,
                contentType: false,
                success: function(result){
                    history.go(0);
                },
                error: function(result){
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

        var id = $(this).parent().parent().parent().prop('id').split('_')[0];
        var disableDivHTML = $(this).parent().parent().parent().find('.disabled').html();

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
            }
        })
    });

    $('.removeBtn').on('click', function(e){
        $('#modifyListError').empty();
        e.preventDefault();

        var id = $(this).parent().parent().parent().prop('id').split('_')[0];
        var itemRow = $(this).parent().parent().parent();
        $.ajax({
            data: {removeId: id},
            type: "post",
            url: "/profile/removeListing",
            success: function(result){
                modalBox.css("display", "block")
                 modalTitle.text(`Attention`)
                var htmlBody =
                `<div>
                  <p>Remove successfully</p>
                </div>
                `
                var htmlFooter = `<button class="btn btn-danger" id="closing" type="button">Cancel</button>`
                modalBody.html(htmlBody)
                modalFooter.html(htmlFooter)

                $('#closing,#closeModal').on('click',function(e){
                   closeModal()
                })
                itemRow.remove();
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
            }
        })
    });

    $('#signout').on('click',function(e){
        e.preventDefault();
        var modalBox = $('#modalCommon')
        var modalTitle = $('#modalCommonTitle')
        var modalBody = $('#modalCommonBody')
        modalBody.attr("style", 'padding: 0px;')
        var modalFooter = $('#modalCommonFooter')
  
        modalBox.css("display", "block")
        modalTitle.text("Do you want to sign out?")
  
        var htmlFooter = `<button class="btn btn-danger" id="closing" type="button">Cancel</button>
                          <button class="btn btn-primary" id="signoutButton" type="button">Sign Out</button>`
        modalBody.empty()
        modalFooter.html(htmlFooter)
  
        $('#closing,#closeModal').on('click',function(e){
          modalTitle.text()
          modalBody.html('')
          modalFooter.html('')
          modalBox.css("display", "none")
        })
        $('#signoutButton').on('click',function(e){
          window.location.href = '/users/signout';
        })
  
    })

    $('.title, .brand, .stock, .price, .seller, .status').on('click', selectItem);
    function selectItem(result) {
        result.preventDefault();
        var id = $(this).parent().prop('id').split('_')[0]
        var status = $(this).parent().prop('id').split('_')[2]
        if(status=="Enabled"){
            var info = {id: id};
            $.post('/item',info,function(result) {
                window.location.href = '/'
            })

        }


    }
});
