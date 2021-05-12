$(document).ready(function() {

  
  $('#goBack').on('click', function(){
    // alert($.session.get('prev'));
    history.go(-1);
    // window.location.href = "/";
    
  });

  $('#changeQuantity').on('click', function(e){
      e.preventDefault();
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
        });

      } else {
        console.log(results)
        $.post('checkout/changeQuantity', results, function(result){

        });

      }
  });

  $('#remove').on('click', function(e){
      e.preventDefault();
      results = getSelectedItems()
        $.post('checkout/removeFromCart', results, function(result){

        });
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
})

function getSelectedItems(quantity){
  console.log("helllooooo");
  cartItem = $('.id');
  checkboxes = $('.cartCheck');
  prices = $('.price');
  quantities = $('.quantity');
  total = 0;
  console.log("cartItem",cartItem);
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
