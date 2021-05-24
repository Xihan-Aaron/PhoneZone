$(document).ready(function() {
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

  $('#goBack').on('click', function(){
    if(document.referrer.split('/').pop()==""){
      window.location.href="/"
    }else{
      history.back(-1);
    }
  });


  $('.title, .image, .price, .quantity, .subtotal').on('click', selectItem);

  $('.quantityDiv').find('input[name="quantity"]').each(function(e){
    $(this).on('click', function(){
      $(this).parent().next().empty();
    })
  })

  $('input[name="changeQuantityButton"]').on('click', function(e){
      var itemId = $(this).parent().parent().parent().prop('id')
      var quantity_id = `#${itemId}_quantity`
      var quantity = $(quantity_id).val();
      var quantityInCart = $(`#${itemId}_quantityCart`).text().trim()
      var error_id = `#${itemId}_error`
      var success_id = `#${itemId}_success`
      var validate = validateInteger(quantity)
      if (validate["status"]=="fail") {
        $(error_id).text(validate["message"])
        $(quantity_id).val('')
        return;
      }
      var info = {item_id:itemId,quantity:quantity}
      $.ajax({
        data:info,
        type:"post",
        url:"checkout/verifyQuantiy",
        error:function(result){
          $(success_id).css("display","none")
          $(error_id).css("display","block")
          $(error_id).text(result["responseJSON"]["message"])
          $(quantity_id).val('')
          return;
        },
        success:function(result){
          if(quantity==quantityInCart){
            return
          }
          else if(quantity == 0) {
            $.ajax({
              data:{items:[itemId]},
              type:"post",
              url:"checkout/removeFromCart",
              success:function(result){
                $(`#${itemId}`).css("display","none")
                updateCartQuantity();

              },
              error:function(result){
                $(success_id).css("display","none")
                $(error_id).css("display","block")
                $(error_id).text(result["responseJSON"]["message"])
              }
            })
          } else {
            $.ajax({
              data:{items:itemId,quantity:quantity},
              type:"post",
              url:"checkout/changeQuantity",
              success:function(result){
                $(`#${itemId}_quantityCart`).text(quantity)
                $(quantity_id).val('')
                $(error_id).css("display","none")
                $(success_id).css("display","block")
                $(success_id).text(`This item has been update to ${quantity}`)
                updateCartQuantity();
              },
              error:function(result){
                $(success_id).css("display","none")
                $(error_id).css("display","block")
                $(error_id).text(result["responseJSON"]["message"])
              }
            })
          }
        }
      })
  });

  $('#remove').on('click', function(e){
    results = getSelectedItems()
    if(results["quantity"]>0){

      modalBox.css("display", "block")
      if(results["quantity"]==1){
        modalTitle.text(`Do you want to remove the ${results["quantity"]} item?`)
      }else{
        modalTitle.text(`Do you want to remove all ${results["quantity"]} items?`)
      }
      var htmlBody = "<div>"
      for (title in results["titles"]){
        htmlBody+=`<p>${title} - ${results["titles"][title]}</p>`
      }
      htmlBody+=`</div>`
      var htmlFooter = `<button class="btn btn-danger" id="closing" type="button">Cancel</button>
                        <button class="btn btn-primary" id="removeAll" type="button">Confirm</button>`
      modalBody.html(htmlBody)
      modalFooter.html(htmlFooter)

      $('#closing,#closeModal').on('click',function(e){
         closeModal()
      })

      function removeAll(){
        $.post('checkout/removeFromCart', results, function(result){
          for(i=0;i<results["items"].length;i++){
            $(`#${results["items"][i]}`).css("display","none")
          }
          $('input[type="checkbox"]').each(function(item){
            $(this).prop("checked", false);
          })
          $('#info').html("<p><span>Items removed from cart successfully</span></p>")
          updateCartQuantity();
        });
        closeModal()
        updateCartQuantity();
      }

      $('#removeAll').on('click',function(event){
        removeAll()
      })


    }else{
      modalBox.css("display", "block")
      modalTitle.text(`Attention`)
      var htmlBody =
      `<div>
        <p>Please select phones to remove</p>
      </div>
      `
      var htmlFooter = `<button class="btn btn-danger" id="closing" type="button">Cancel</button>`
      modalBody.html(htmlBody)
      modalFooter.html(htmlFooter)

      $('#closing,#closeModal').on('click',function(e){
         closeModal()
      })
    }
  });

  $('#confirm').on('click', function(e){

    results = getSelectedItems()
    console.log(results)


    if(results["quantity"]==0){
      modalBox.css("display", "block")
       modalTitle.text(`Attention`)
      var htmlBody =
      `<div>
        <p>Please select phones to buy</p>
      </div>
      `
      var htmlFooter = `<button class="btn btn-danger" id="closing" type="button">Cancel</button>`
      modalBody.html(htmlBody)
      modalFooter.html(htmlFooter)

      $('#closing,#closeModal').on('click',function(e){
         closeModal()
      })
    }else{
      modalBox.css("display", "block")
      if(results["quantity"]==1){
        modalTitle.text(`Are you sure you want to buy this?`)
      }else{
        modalTitle.text(`Are you sure you want to buy these ${results["quantity"]} items?`)
      }
      var htmlBody =
      `<div>
        <p>Total Quantity: ${results["quantity"]}</p>
        <p>Total Cost: ${results["total"]}</p>
      </div>
      `
      var htmlFooter = `<button class="btn btn-danger" id="closing" type="button">Cancel</button>
                        <button class="btn btn-success" id="confirmBuy" type="button">Confirm</button>`
      modalBody.html(htmlBody)
      modalFooter.html(htmlFooter)

       $('#closing,#closeModal').on('click',function(e){
         closeModal()
      })


      function buyAll(){
        $.ajax({
          data:results,
          type:"post",
          url:"checkout/clearCart",
          success:function(result){
            closeModal()
            for(i=0;i<results["items"].length;i++){
              $(`#${results["items"][i]}`).css("display","none")
            }
            $('#info').html("<p><span>Purchase Success</span></p>")
            updateCartQuantity();
            window.location.href = "/"
          },
          error:function(result){

          }
        })
        updateCartQuantity();
      }

      $(document).keydown(function (event) {
          if ( (event.keyCode || event.which) === 13) {
              $("#confirmBuy").click();
          }
        });

      $('#confirmBuy').on('click',function(event){
        buyAll()
      })
    }
  })
  updateCartQuantity()
})


function getSelectedItems(){
  updateCartQuantity();
  var selectedItemsId = [];
  var selectedItemsTitle = {};
  var selectedItemsQuantity = {};
  var quantityTotal = 0;
  var priceTotal = 0;
  $('input[type="checkbox"]:checked').each(function(item){
    var item_id=$(this).parent().parent().parent().parent().prop('id')
    var quantity_id=`#${item_id}_quantityCart`
    var title_id=`#${item_id}_title`
    var price_id=`#${item_id}_price`
    var price = parseFloat($(price_id).text().trim())
    var quantity = parseInt($(quantity_id).text().trim())
    var title = $(title_id).text().trim()
    selectedItemsId.push(item_id)
    selectedItemsTitle[title]=quantity
    selectedItemsQuantity[item_id]=quantity
    quantityTotal+=quantity
    priceTotal+=parseFloat(price*quantity)
  })
  return {
    titles:selectedItemsTitle,
    items: selectedItemsId,
    quantity: quantityTotal,
    selectedItemsQuantity:selectedItemsQuantity,
    total:priceTotal.toFixed(2)
  }
}

function selectItem(result) {
      result.preventDefault();
      var id = {id: $(this).parent().prop('id') };

      $.post('/item',id,function(result) {
        window.location.href = '/'
      })
}
function updateCartQuantity() {
  $.post('/getCartInfo',function(result) {
    $('#cartQuantity').empty()
    $('#cartQuantity').text(`Total items: ${result.cartQuantity}`)
    $('#cartPrice').empty()
    $('#cartPrice').text(`Total price: $${result.cartPrice}`)
  })
}
