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

  $('#closing,#closeModal').on('click',function(e){
         closeModal()
    })

    $('input[name="email"]').on('focus', function(e){
        $('#emailError').empty();
        $('#serversideError').empty();
    });
    $('input[name="password"]').on('focus', function(e){
        $('#passwordError').empty();
        $('#serversideError').empty();
    });
    
    $(document).keydown(function (event) {
        if ( (event.keyCode || event.which) === 13) {
            $("#signinBtn").click();
        }
    });
    $('#signinBtn').on('click', function(e){
        $('#emailError').empty();
        $('#passwordError').empty();
        $('#serversideError').empty();
        e.preventDefault();
        var signinInfo = {
            email: $('#email').val().trim(),
            password: $('input[name="password"]').val()
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
                    window.location.href="/"
                },
                error: function(result){for(var i = 0; i < result.responseJSON.errors.length; i++){
                        $('#serversideError').append('<p class="error">- ' + result.responseJSON.errors[i] + '</p>');
                    }
                }
            });
        }
    });
    $('#forgotPassword').on('click', function(e){
        modalBox.css("display", "block")
        modalTitle.text(`Please Enter your email`)

        var htmlBody = `
          <div class="form-group">
            <input type="email" class="form-control" id="forgetEmailPassword" min=0  placeholder="Enter your email">
          </div>
          <div class="error" id="modalError"></div>
          <div class="success" id="modalSuccess"></div>
          `
        var htmlFooter = `<button class="btn btn-danger" id="closing" type="button">Cancel</button>
                          <button class="btn btn-primary" id="sendLink" type="button">Send Link</button>`
        modalBody.html(htmlBody)
        $('#sendLink').css("display","block")
        modalFooter.html(htmlFooter)

        $('#closing,#closeModal').on('click',function(e){
           closeModal()
        })


        $('#sendLink').on('click',function(event){
            var email= $('#forgetEmailPassword').val().trim()
            console.log(email)
            if(email.length==0 ){
                $('#modalError').text("Please provide a correct email")
            }else{
              $.ajax({
                data:{email:email},
                type:"post",
                url:"/users/forgotPassword",
                success:function(result){
                    $('#modalError').css("display","none")
                    $('#modalSuccess').css("display","block")
                    $('#modalSuccess').text(result["message"])
                    $('#sendLink').css("display","none")
                },
                error:function(result){
                    response =result["responseJSON"]
                    $('#modalSuccess').css("display","none")
                    $('#modalError').css("display","block")
                    if(response["message"].indexOf("sign up")>-1){
                        $('#modalError').html(`<p> ${response["message"]} <a href="/users/signup"> Click here </a> </p>` )
                    }else{
                        $('#modalError').text(response["message"])
                    }
                  
                }
              })         
            }

        })
    })
});