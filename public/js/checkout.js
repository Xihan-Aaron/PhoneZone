$(document).ready(function() {
  $('#goBack').on('click', function(){
    console.log(document.referrer.split('/').pop()=="")
    if(document.referrer.split('/').pop()==""){
      window.location.href="/"
    }
    history.back(-1);
  });


  $('.title').on('click', selectItem);

  // $('#changeQuantity').on('click', function(e){
  //     // e.preventDefault();
  //     var quantity = $('input[name="quantity"]').val();
  //     if ($('input[name="quantity"]').val() == "" ||
  //         isNaN(quantity) || quantity < 0) {
  //       console.log(quantity);
  //       alert("Please type in a valid quantity.");
  //       return;
  //     }
  //     results = getSelectedItems(quantity);
  //     if(results.items.length == 0) {
  //       alert('no items selected')
  //       return;
  //     }
  //
  //     if(quantity == 0) {
  //       $.post('checkout/removeFromCart',results, function(result){
  //           // history.back(-1)
  //       });
  //
  //     } else {
  //       console.log(results)
  //       $.post('checkout/changeQuantity', results, function(result){
  //         // history.back(-1)
  //
  //       });
  //       updateCartQuantity();
  //     }
  // });

  $('.changeQuantity').on('click', function(e){
      e.preventDefault();
      cartItem = $(this).closest('tr')
      var quantity = cartItem.find('input[name="quantity"]').val()
      var id = cartItem.find('.id')[0].innerHTML
      if (quantity == "" ||
          isNaN(quantity) || quantity < 0) {
        alert("Please type in a valid quantity.");
        return;
      }
      item = {id:id ,quantity:parseInt(quantity)}

      // // if(quantity == 0) {
      //   $.post('checkout/removeFromCart',item, function(result){
      //     if(result.msg == "added") {
      //       alert("success")
      //       updateCartTotals()
      //     } else if(result.msg == "removed") {
      //       alert("removed")
      //       cartItem.remove()
      //       updateCartTotals()
      //     } else {
      //       alert(result.error)
      //     }
      //   });
      //
      // } else {
        $.post('checkout/changeQuantity', item, function(result){
          // history.back(-1)
          if(result.msg == "added") {
            alert("success")
            updateCartTotals()
          } else if(result.msg == "removed") {
            alert("removed")
            cartItem.remove()
            updateCartTotals()
          } else {
            alert(result.error)
          }
        });

      // }
      // updateCartTotals()
})

  $('#remove').on('click', function(e){
      e.preventDefault();
      results = getSelectedItems()
        $.post('checkout/removeFromCart', results, function(result){

        });
        updateCartTotals()

  });

  $('#confirm').on('click', function(e){
      e.preventDefault();
      cartItem = $('.id');
      var selectedItems = [];
      for(var i =0; i<cartItem.length;i++) {
        selectedItems.push(cartItem[i].innerHTML)
      }
      results = {items: selectedItems}
        $.post('checkout/clearCart', results, function(result){

        });
  });

  updateCartTotals()
})

function getSelectedItems(quantity){
  cartItem = $('.cartItem');
  itemId = $('.id');
  checkboxes = $('.cartCheck');
  prices = $('.price');
  quantities = $('.quantity');
  var selectedItems = [];
  for(var i =0; i<itemId.length;i++) {
    if(checkboxes[i].checked) {
      selectedItems.push(itemId[i].innerHTML)
      cartItem[i].remove()
    }
  }
  return {items: selectedItems,quantity: quantity}
}

function selectItem(result) {
      result.preventDefault();
      var id = {id: $(this).find('.id').text() };
      console.log(id);

      $.post('/item',id,function(result) {
        // $('#soldOutSoon').remove();
        // $('#bestSellers').remove();
        // $('#searchResult').empty();
        // $('#heading').empty();
        // viewItem(result.info);
      })
}

function updateCartTotals() {
  $.post('/getCartInfo',function(result) {
    console.log("post getCartInfo",result);
    // $('#cartQuantity').empty()
    $('#cartQuantity').text(result.cartQuantity)
    // $('#cartPrice').empty()
    $('#cartPrice').text(result.cartPrice)
  })
}
