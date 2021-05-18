$(document).ready(function() {

    $('input[name="searchtext"]').on('focus', function(e){
        $('#searchError').empty();
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

    function searchButton(e){
      $('#searchError').empty();
      e.preventDefault();
      var searchText = {searchtext: $('input[name="searchtext"]').val()};
      if ($('input[name="searchtext"]').val() != ""){
          $.post('/search', searchText, function(result){
              // console.log(result);
              if (result.searchResults.length < 1){
                  $('#searchError').append('<p class="error">- No search result found.</p>');
                  if($('.searchItem').length > 0){
                    $('.searchItem').each(function(){
                      $(this).remove();
                    });
                  }
              } else {
                  $('#searchRange').css("display","block")//Reinstate the range finder
                  $('#searchFilter').css("display","block") // Reinstate the search filter
                  viewSearch(result.searchResults);
                  addDropDown(result.searchResults);
                  addRange(result.searchResults);
                  $('#soldOutSoon').remove();
                  $('#bestSellers').remove();
                  $('#itemInfo').empty();
                  $('#filter').on('change', changeFilter);
                  $('#priceRange').on('change', changeRange);
                  $('.searchItem').on('click', selectItem);
              }
          });
          $.session.set('prev', 'search');
          $.session.set('searchText', $('input[name="searchtext"]').val());
      }
    }

    $('#searchBtn').on('click', function(e){searchButton(e)});
    $('#search').find('input[name="searchtext"]').bind('keypress', function(e){
      if(e.keyCode == 13){
        searchButton(e)
      }
    });

    $('.soldOutItem').on('click', selectItem);
    $('.searchItem').on('click', selectItem);
    $('.topFiveItem').on('click', selectItem);
    // Not necessary anymore
    // $('#confirmsignoutBtn').on('click', function(e){
    //   console.log('here')
    //   e.preventDefault();
    //   $('#signoutModal').modal('hide');
    //   window.location.href = '/users/signout';
    // });

    $('.reviews').on('click', showMoreComments);
    $('.showMoreReviews').on('click', showMoreReviews);
    $('#addToCart').on('click', modalPopUpAddCart);
    updateCartQuantity();
});

function viewSearch(result){
    $('#heading').empty();
    $('#heading').append("Search results");
    var searchSection = $('#searchResult');
    searchSection.empty();
    // searchSection.append("<h3>Search results</h3>");
    var table = '<table class="table table-hover">';
    var tableTitle = '<thead><th></th><th>Title</th><th>Brand</th><th>Price</th><th>Stock</th></thead>';
    var tableBody = '<tbody>';
    for(var i = 0; i < result.length; i++){
        var tableRow = '<tr class="searchItem ' + result[i].brand + '">';
        // console.log(tableRow);
        tableRow += '<td class="id hide">' + result[i]._id + '</td>';
        tableRow += '<td><img src=' + result[i].image + ' alt="" class="thumbnail"></td>';
        tableRow += '<td class="title">' + result[i].title + '</td>';
        tableRow += '<td class="brand">' + result[i].brand + '</td>';
        tableRow += '<td class="price">' + result[i].price + '</td>';
        tableRow += '<td class="stock">' + result[i].stock + '</td>';
        tableRow += '<td class="seller hide">' + result[i].seller + '</td>'
        // tableRow += '<td class="review hide">';
        // for (var j = 0; i < result[i].reviews.length; i++){
        //     tableRow += '<div class="reviewDetails">' + result[i].reviews[j] + '</div>'
        // }
        // tableRow += '</td>'
        tableRow += '</tr>';
        tableBody += tableRow;
    }
    tableBody += '</tbody>';
    table += tableTitle + tableBody + '</table>'
    var tableDiv = '<div class="table-responsive">' + table + '</div>'
    searchSection.append(tableDiv)
}

function viewItem(result) {
  $('#searchRange').css("display","none") //Hide the range finder
  $('#searchFilter').css("display","none") //Hide the search filter
  $('#heading').append(result.title);
  var info = $('#itemInfo');
  // info.append('<h3 id="heading">' + result.title + '</h3>');

  var image = '<img src=' + result.image + ' alt="" style="width: 12em;">'

  div = '<div class="row"> <div class="col-md-6">' + image + '</div>'
  div += '<div class="col-md-6">'
  div += '<p id="itemId" class="hide"> ' + result._id  + '</p>'
  div += '<p> Brand: ' + result.brand  + '</p>'
  div += '<p> Stock: <span id="itemStock">' + result.stock  + '</span></p>'
  div += '<p> Seller: ' + result.seller  + '</p>'
  div += '<p> Price: <span id="itemPrice">' + result.price  + '</span></p>'
  div += '<input id="addToCart" class="btn btn-primary" type="button" value="Add to Cart" role="button" />'
  div += '</div></div> '

  info.append(div)

  var reviews = result.reviews;

  var table = '<table class="table table-hover">';
  var tableTitle = '<thead><th>Reviewer</th><th>Rating</th><th>Comment</th></thead>';
  var tableBody = '<tbody>';
  if(reviews == undefined || reviews.length == 0) {
    var tableRow = '<tr class="reviews ' + '">';
    tableRow += '<td colspan=3>' + 'No Reviews Yet' + '</td>'
    tableRow += '</tr>';
    tableBody += tableRow;

  } else {
    for(var i = 0; i < reviews.length; i++){
      if(i >= 3) {
        var tableRow = '<tr class="reviews hide ' +  '">';

      } else {
        var tableRow = '<tr class="reviews ' + '">';
      }
      // console.log(tableRow);
      tableRow += '<td class="id hide">' + reviews[i].id + '</td>';
      tableRow += '<td class="reviewer">' + reviews[i].reviewer + '</td>';
      tableRow += '<td class="rating">' + reviews[i].rating + '</td>';

      if(reviews[i].comment.length > 200) {
        tableRow += '<td class="partialComment ">' + reviews[i].comment.substring(0,200) + '<p class="textComment"> (Show More) </p>' + '</td>';
        tableRow += '<td class="fullComment hide">' + reviews[i].comment + '<p class="textComment"> (Show Less) </p>' + '</td>';
      } else {
        tableRow += '<td class="comment">' + reviews[i].comment + '</td>';
      }

      tableRow += '</tr>';
      tableBody += tableRow;
    }
    if(reviews.length > 3) {
      tableBody += '<tr > <td class="showMoreReviews" colspan=2><p class="textComment">show more comments</p></td> '
      tableBody += '<td class="showLessReviews hide" colspan=3><p class="textComment">show less comments</p></td><td></td> </tr>'
    }
  }

  tableBody += '</tbody>';
  table += tableTitle + tableBody + '</table>'
  var tableDiv = '<div class="table-responsive">' + table + '</div>'

  info.append(tableDiv)

  $('.reviews').on('click', showMoreComments)
  $('.showMoreReviews').on('click', showMoreReviews)
  $('.showLessReviews').on('click', showLessReviews)
  $('#addToCart').on('click', modalPopUpAddCart)
}

function showMoreComments(e) {
  e.preventDefault();
  var comment = $(this).find('.partialComment');
  var fullComment = $(this).find('.fullComment');
  comment.toggleClass("hide")
  fullComment.toggleClass("hide")
}

function showMoreReviews(e) {
    e.preventDefault();
    reviews = $('.reviews');
    var added = 0;
    var more = true;
    for(var i =0; i<reviews.length;i++) {
      if(i == reviews.length -1 && added < 3) {
        more = false;
      }
      if(added >= 3) {
        break;
      }
      if(reviews[i].classList.contains("hide")) {
        reviews[i].classList.remove("hide");
        added++;

      }
    }
    if(!more) {
      $('.showMoreReviews').addClass('hide')
    }
    if($('.showLessReviews').hasClass('hide')) {
      $('.showLessReviews').removeClass('hide')
    }
}

function showLessReviews(e) {
    e.preventDefault();
    reviews = $('.reviews');
    var hidden = 0;
    var less = true;
    for(var i =0; i<reviews.length;i++) {
      currentIndex = reviews.length-1 - i
      if(currentIndex < 3 && hidden <= 3) {
        less = false;
        break;
      }
      if(hidden >= 3) {
        break;
      }
      if(!reviews[currentIndex].classList.contains("hide")) {
        reviews[currentIndex].classList.add("hide");
        hidden++;

      }
    }
    if(!less) {
      $('.showLessReviews').addClass('hide')
    }
    if($('.showMoreReviews').hasClass('hide')) {
      $('.showMoreReviews').removeClass('hide')
    }
}


function modalPopUpAddCart(e){
  var id = $('#itemId').text().trim();
  var price = $('#itemPrice').text().trim();
  var maxQuantity =parseInt($('#itemStock').text().trim())

  var modalBox = $('#modalCommon')
  var modalTitle = $('#modalCommonTitle')
  var modalBody = $('#modalCommonBody')
  modalBody.attr("style", 'padding: 15px;')
  var modalFooter = $('#modalCommonFooter')



  modalBox.css("display", "block")
  modalTitle.text("Please enter the quantity you would like to purchase")
  var htmlBody = `
  <div class="form-group">
    <input type="number" class="form-control" step=1 id="quantityInput" min=0  placeholder="Enter quantity Purchase">
  </div>
  <div class="error" id="modalError">
  </div>
  `

  var htmlFooter = `<button class="btn btn-danger" id="closing" type="button">Cancel</button>
                    <button class="btn btn-primary" id="submitAddtoCart" type="button">Add to Cart</button>`
  console.log(modalFooter)
  modalBody.html(htmlBody)
  modalFooter.html(htmlFooter)

  $('#closing,#closeModal').on('click',function(e){
    modalTitle.text()
    modalBody.html('')
    modalFooter.html('')
    modalBox.css("display", "none")
  })

  function submitCart(){
    var quantityPurchase =$('#quantityInput').val();
    validate = validateInteger(quantityPurchase)
    if(validate["status"]=="fail"){
      $('#modalError').text(validateInteger(quantityPurchase)["message"])
    }else if (validate["status"]=="success" && validate["value"]==0){
      $('#modalError').text("Please enter a digit greater than 0")
    }else if (validate["status"]=="success" && validate["value"]>maxQuantity){
      $('#modalError').text("Not enough stock. Please wait for restock")
    }else{
      var info = {id:id,quantity:quantityPurchase,price:price,maxQuantity:maxQuantity};
      $.ajax({
        data:info,
        type:"post",
        url:"/addToCart",
        success:function(result){
          updateCartQuantity()
          modalTitle.text()
          modalBody.html('')
          modalBox.css("display", "none")
        },
        error:function(result){
          response =result["responseJSON"]
          if(response["type"]=="signin"){
            var responsehtml=`<p> ${response["message"]}. Please click here to <a href="/users/signin"> Sign In</a></p>`
            $('#modalError').html(responsehtml )
          }else{
            $('#modalError').text(response["message"] )
          }
        }
      })
    }
  }
  $(document).keydown(function (event) {
    if ( (event.keyCode || event.which) === 13) {
        $("#submitAddtoCart").click();
    }
  });

  $('#submitAddtoCart').on('click',function(event){
    submitCart()
  })
}


function updateCartQuantity() {
  $.post('/getCartInfo',function(result) {
    console.log("post getCartInfo",result);
    // $('#cartQuantity').empty()
    $('#cartQuantity').text(result.cartQuantity)
  })
}

function selectItem(result) {
      result.preventDefault();
      var id = {id: $(this).find('.id').text() };
      console.log(id);

      $.post('/item',id,function(result) {
        $('#soldOutSoon').remove();
        $('#bestSellers').remove();
        $('#searchResult').empty();
        $('#heading').empty();
        viewItem(result.info);
        $.session.set('prev', 'item');
        $.session.set('itemId', id);

      })
}

function addDropDown(result){
    var section = $('#searchFilter');
    section.empty();
    // var filterList = '<li class="dropdown">';
    var filterList = '<select id="filter" class="navbar-form navbar-left">';
    filterList += '<option>All</option>';
    var brandList = [];
    if (result.length > 0){
        brandList.push(result[0].brand);
        for(var i = 1; i < result.length; i++){
            if (!brandList.includes(result[i].brand)){
                brandList.push(result[i].brand);
            }
        }
        brandList.sort();
    }
    // console.log(brandList);
    for(var i = 0; i < brandList.length; i++){
        filterList += '<option>' + brandList[i] + '</option>';
    }
    filterList += '</select>';
    section.append(filterList);
}

function addRange(result){
    var section = $('#searchRange');
    section.empty();
    var priceList = [];
    var max = 50;
    if (result.length > 0){
        for(var i = 0; i < result.length; i++){
            priceList.push(result[i].price);
        }
        max = Math.max(...priceList) + 1;
    }
    console.log(max);
    var rangeComponent ='<div id="rangeSection">';
    rangeComponent += '<input type="range" class="form-range" id="priceRange" min="0" ' + 'max="' + parseInt(max) + '"' + '></div>';
    rangeComponent += '<div style="text-align: center;"><span style="float: left;">0</span><span>' + parseInt(max / 2) + '</span>' + '<span style="float: right;">' + parseInt(max) + '</span></div>';
    section.append(rangeComponent);
    var rangeUlitily = '<div class="text-right"><span>Current price: </span>'
    rangeUlitily += '<span id="rangeValue">' + parseInt($('#priceRange').val()); + '</span></div>'

    $("#rangeSection").prepend(rangeUlitily);

}

function changeFilter(){
    var brandFilter = $('#filter').val();
    var priceFilter = parseFloat($('#priceRange').val());

    if(brandFilter != 'All'){
        $('.searchItem').each(function(){
            if(!$(this).hasClass(brandFilter)){
                if(!$(this).hasClass('hide')){
                    $(this).addClass('hide');
                }
            } else {
                $(this).removeClass('hide');
                console.log(parseFloat($(this).find('.price').text()));
                if(parseFloat($(this).find('.price').text()) > priceFilter){
                    $(this).addClass('hide');
                }
            }
        });
    } else {
        $('.searchItem').each(function(){
            $(this).removeClass('hide');
        })
    }
}

function changeRange(){
    var price = parseFloat($('#priceRange').val());
    $('#rangeValue').text(price);
    var brandFilter = $('#filter').val();
    console.log("Current threshold: " + price.toString());
    console.log(brandFilter);

    $('td.price').each(function(){
        if (parseFloat($(this).text()) > price){
            if(!$(this).parent().hasClass('hide')){
                $(this).parent().addClass('hide');
            }
            // $(this).parent().hide();
        } else {
            $(this).parent().removeClass('hide');
            if(!$(this).parent().hasClass(brandFilter)){
                if(brandFilter != 'All'){
                    $(this).parent().addClass('hide');
                }
            }
        }
    });
};
