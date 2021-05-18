function showmodal(type,info){
  console.log(type);
  if(type == "alert") {
    console.log("alerted");
    showModalBtn(false)
    showModalInput(false)
    $('#modalLabel').text(info.msg)
  } else if(type == "confirm") {
    console.log("confirmed");

    showModalBtn(true)
    showModalInput(false)
    // $('#modalLabel').modal('show')
  } else if(type == "prompt") {
    console.log("prompted");

    showModalBtn(true,info)
    showModalInput(true)
  } else {
    return;
  }
  $('#modalTemplate').modal('toggle')
  console.log($('#modalTemplate'));
  $('#modalLabel').text(info.msg)

}

function showModalBtn(show,info) {
  // $('#modalBtn').modal({show:show})

  if(show) {
    $('#modalBtn').removeClass("hide")
    if(info.funct != null) {
      $('#modalBtn').on('click',function(e){
        console.log('here')
        console.log(info.funct)
        e.preventDefault();
        input = $('input[name="modalInput"]').val()
        $('#modalTemplate').modal('hide');
        info.funct(input)
        // window.location.href = '/users/signout';
      });
    } else {
      $('#modalBtn').on('click', function(e){
        console.log('here')
        e.preventDefault();
        $('#modalTemplate').modal('hide');
        window.location.href = '/users/signout';
      })
    }
  }

}

function showModalInput(show) {
  console.log("modal input ", show);
  // $('#modalInput').modal({show:show})
  if(show) {
    $('#modalInput').addClass("hide")
  }

}
