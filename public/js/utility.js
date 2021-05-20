function showmodal(type,info){
  if(type == "alert") {
    showModalBtn(false)
    showModalInput(false)
    $('#modalLabel').text(info.msg)
  } else if(type == "confirm") {

    showModalBtn(true)
    showModalInput(false)
    // $('#modalLabel').modal('show')
  } else if(type == "prompt") {

    showModalBtn(true,info)
    showModalInput(true)
  } else {
    return;
  }
  $('#modalTemplate').modal('toggle')
  $('#modalLabel').text(info.msg)

}

function showModalBtn(show,info) {
  // $('#modalBtn').modal({show:show})

  if(show) {
    $('#modalBtn').removeClass("hide")
    if(info.funct != null) {
      $('#modalBtn').on('click',function(e){
        e.preventDefault();
        input = $('input[name="modalInput"]').val()
        $('#modalTemplate').modal('hide');
        info.funct(input)
        // window.location.href = '/users/signout';
      });
    } else {
      $('#modalBtn').on('click', function(e){
        e.preventDefault();
        $('#modalTemplate').modal('hide');
        window.location.href = '/users/signout';
      })
    }
  }

}

function showModalInput(show) {
  // $('#modalInput').modal({show:show})
  if(show) {
    $('#modalInput').addClass("hide")
  }

}
