$(document).ready(function() {
  // console.log($.session.get('prev'));

  // if($.session.get('prev') == 'search'){
  //   // window.location.href = "/";
  //   var searchText = $.session.get('searchText');
  //   $.post('/search', searchText, function(result){
  //     viewSearch(result.searchResults);
  //     addDropDown(result.searchResults);
  //     addRange(result.searchResults);
  //     $('#soldOutSoon').remove();
  //     $('#bestSellers').remove();
  //     $('#itemInfo').empty();
  //     $('#filter').on('change', changeFilter);
  //     $('#priceRange').on('change', changeRange);
  //     $('.searchItem').on('click', selectItem);
  //   });
  // } else if($.session.get('prev') == 'item'){
  //   var id = $.session.get('itemId');
  //   console.log(id);
  //   // window.location.href = "/";
  //   $.post('/item',id,function(result) {
  //     alert(result.info)
  //     viewItem(result.info);
  //     $('#soldOutSoon').remove();
  //     $('#bestSellers').remove();
  //     $('#searchResult').empty();
  //     console.log("he")
  //     $.session.set('prev', 'item');
  //     $.session.set('itemId', id);
  //   });
  // } else {
  //   $.session.set('prev', 'home');
  // }

    
    // $.session.set('prev', 'home');
    // var searchResultBackup;

    $('input[name="searchtext"]').on('focus', function(e){
        $('#searchError').empty();
    });

    $('#searchBtn').on('click', function(e){
      
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
<<<<<<< HEAD
        } 
=======
            $.session.set('prev', 'search');
            $.session.set('searchText', $('input[name="searchtext"]').val());
        } else {
          $('#searchError').append('<p class="error">- No search result found.</p>');
        }
>>>>>>> 0627f97243c5f14b9dd4ee6f13b163a993abda72
    });

    $('#search').find('input[name="searchtext"]').bind('keypress', function(e){
        if(e.keyCode == 13){
            $('#searchError').empty();
            e.preventDefault();
            var searchText = {searchtext: $('input[name="searchtext"]').val()};
            if ($('input[name="searchtext"]').val() != ""){
                $.post('/', searchText, function(result){
                    // console.log(result);
                    if (result.searchResults.length < 1){
                      $('#searchError').append('<p class="error">- No search result found.</p>');
                    }
                    // searchResultBackup = result.searchResults;
                    viewSearch(result.searchResults);
                    addDropDown(result.searchResults);
                    addRange(result.searchResults);
                    $('#soldOutSoon').remove();
                    $('#bestSellers').remove();
                    $('#filter').on('change', changeFilter);
                    $('#priceRange').on('change', changeRange);
                });
                $.session.set('prev', 'search');
                $.session.set('searchText', $('input[name="searchtext"]').val());
            } else {
              $('#searchError').append('<p class="error">- No search result found.</p>');
            }
        }
    });

    $('.soldOutItem').on('click', selectItem);
    $('.searchItem').on('click', selectItem);
    $('.topFiveItem').on('click', selectItem);
});

function viewSearch(result){
    var searchSection = $('#searchResult');
    searchSection.empty();
    searchSection.append("<h3>Search results</h3>");
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
  var info = $('#itemInfo');
  info.append('<h3>' + result.title + '</h3>');

  var image = '<img src=' + result.image + ' alt="">'

  div = '<div class="row"> <div class="col-md-6">' + image + '</div>'
  div += '<div class="col-md-6">'
  div += '<p id="itemId" class="hide"> ' + result._id  + '</p>'
  div += '<p> brand: ' + result.brand  + '</p>'
  div += '<p> stock: ' + result.stock  + '</p>'
  div += '<p> seller: ' + result.seller  + '</p>'
  div += '<p> price: ' + result.price  + '</p>'
  div += '<input id="addToCart" class="btn btn-primary" type="button" value="Add to Cart" role="button" />'
  div += '</div> </div> '

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
          tableRow += '<td class="partialComment ">' + reviews[i].comment.substring(0,200) + "<b>...Show More...</b>" + '</td>';
          tableRow += '<td class="fullComment hide">' + reviews[i].comment + '</td>';
        } else {
          tableRow += '<td class="comment">' + reviews[i].comment + '</td>';
        }

        tableRow += '</tr>';
        tableBody += tableRow;
    }
    if(reviews.length > 3) {
      tableBody += '<tr class="showMoreComments"> <td colspan=3>show more</td> </tr>'
    }
  }

  tableBody += '</tbody>';
  table += tableTitle + tableBody + '</table>'
  var tableDiv = '<div class="table-responsive">' + table + '</div>'

  info.append(tableDiv)

  $('.reviews').on('click', function(e){
    e.preventDefault();
    var comment = $(this).find('.partialComment');
    var fullComment = $(this).find('.fullComment');
    comment.toggleClass("hide")
    fullComment.toggleClass("hide")
  })
  $('.showMoreComments').on('click', function(e){
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
      $('.showMoreComments').addClass('hide')
    }
  })

  $('#addToCart').on('click', function(e){
    var id = $('#itemId').text().trim();
    while (quantity = prompt("Input number: ")) {
      if (isNaN(quantity) || quantity < 0) {
        alert("Invalid input.");
      } else {
        quantity = parseInt(quantity)
        break;
      }
    }
    var info = {id:id,quantity:quantity};
    $.post('/addToCart',info,function(result) {
      viewItem(result.info);
    })
  })

}

function selectItem(result) {
      result.preventDefault();
      var id = {id: $(this).find('.id').text() };
      console.log(id);

      $.post('/item',id,function(result) {
        viewItem(result.info);
        $('#soldOutSoon').remove();
        $('#bestSellers').remove();
        $('#searchResult').empty();
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
}
