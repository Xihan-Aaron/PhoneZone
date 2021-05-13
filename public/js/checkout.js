$(document).ready(function() {
  $('#goBack').on('click', function(){
    if(document.referrer.split('/').pop()==""){
      window.location.href="/"
    }
    history.back(-1);
  });

  $('.cartItem').on('click', selectItem);

  $('#changeQuantity').on('click', function(e){
      // e.preventDefault();
      var quantity = $('input[name="quantity"]').val();
      if ($('input[name="quantity"]').val() == "" ||
          isNaN(quantity) || quantity < 0) {
        console.log(quantity);
        alert("Please type in a valid quantity.");
        return;
      }
      results = getSelectedItems(quantity);
      if(results.items.length == 0) {
        alert('no items selected')
        return;
      }

      if(quantity == 0) {
        $.post('checkout/removeFromCart',results, function(result){
            history.back(-1)
        });

      } else {
        console.log(results)
        $.post('checkout/changeQuantity', results, function(result){
          history.back(-1)

        });

      }
  });

  $('#remove').on('click', function(e){
      // e.preventDefault();
      results = getSelectedItems()
        $.post('checkout/removeFromCart', results, function(result){
          // history.back(0)

        });
  });

  $('#confirm').on('click', function(e){
      // e.preventDefault();
      if(!confirm("are you sure?")) {
        return
      }
      cartItem = $('.id');
      quantities = $('.quantity');
      var selectedItems = [];
      var quantity = [];

      for(var i =0; i<cartItem.length;i++) {
        selectedItems.push(cartItem[i].innerHTML)
        quantity.push(quantities[i].innerHTML)
      }
      results = {items: selectedItems,quantity:quantity}
        $.post('checkout/clearCart', results, function(result){
          alert("added to cart")
          history.back(-1)

        });
  });
})

function getSelectedItems(quantity){
  cartItem = $('.id');
  checkboxes = $('.cartCheck');
  prices = $('.price');
  quantities = $('.quantity');
  total = 0;
  var selectedItems = [];
  for(var i =0; i<cartItem.length;i++) {
    if(checkboxes[i].checked) {
      selectedItems.push(cartItem[i].innerHTML)
      total += parseFloat(prices[i])*parseInt(quantity)
    } else {
      total += parseFloat(prices[i])*parseInt(quantities[i])
    }
  }
  return {items: selectedItems,quantity: quantity,total:total}
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

function updateCartQuantity() {
  $.post('/getCartInfo',function(result) {
    console.log("post getCartInfo",result);
    $('#cartQuantity').empty()
    $('#cartQuantity').append(result.cartQuantity)
  })
}
