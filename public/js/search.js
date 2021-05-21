// $(document).ready(function(){
//     $.session.set('prev', 'search');
//     $.session.set('searchText', $('input[name="searchtext"]').val());
// });
$('#searchResult').empty();
// $.session.set('prev', 'search');
// $.session.set('searchText', $('input[name="searchtext"]').val());
function collectBrand(){
    var tempList = [];
    var brandList = [];
    $('.brand').each(function(){
        tempList.push($(this).text());
    });
    brandList.push(tempList[0]);
    for (var i = 0; i < tempList.length; i++){
        if(!brandList.includes(tempList[i])){
        brandList.push(tempList[i]);
        }
    }
    brandList.sort();
    return brandList;
}
function maxPrice(){
    var priceList = [];
    $('.price').each(function(){
        priceList.push(parseFloat($(this).text()));
    });
    var max = 50;
    if(priceList.length > 0){
        max = Math.max(...priceList);
    }
    // priceList.sort();
    return max + 1;
}
function addFilter(brandList){
    var section = $('#searchFilter');
    section.empty();
    var filterList = '<select id="filter" class="navbar-form navbar-left">';
    filterList += '<option>All</option>';
    if(brandList.length > 0){
        for(var i = 0; i < brandList.length; i++){
            filterList += '<option>' + brandList[i] + '</option>';
        }
    }
    filterList += '</select>';
    section.append(filterList);
}
function addRange(max){
    var section = $('#searchRange');
    section.empty();
    var rangeComponent ='<div id="rangeSection">';
    rangeComponent += '<input type="range" class="form-range" id="priceRange" min="0" ' + 'max="' + parseInt(max) + '"' + '></div>';
    rangeComponent += '<div style="text-align: center;"><span style="float: left;">0</span><span style="float: none;">' + parseInt(max / 2) + '</span>' + '<span style="float: right;">' + parseInt(max) + '</span></div>';
    section.append(rangeComponent);
    var rangeUlitily = '<div class="text-right"><span>Current price: </span>'
    rangeUlitily += '<span id="rangeValue">' + parseInt($('#priceRange').val()); + '</span></div>'

    $("#rangeSection").prepend(rangeUlitily);
  }

addFilter(collectBrand());
addRange(maxPrice());
$('#filter').on('change', function(){
    var brandFilter = $('#filter').val();
    var priceFilter = parseFloat($('#priceRange').val());
    // $('tr.searchItem').show();

    if(brandFilter != 'All'){
        $('.searchItem').each(function(){
            if(!$(this).hasClass(brandFilter)){
                if(!$(this).hasClass('hide')){
                    $(this).addClass('hide');
                }
            } else {
                $(this).removeClass('hide');
                if(parseFloat($(this).find('.price').text()) > priceFilter){
                    $(this).addClass('hide');
                }
            }
        });
    } else {
        $('.searchItem').each(function(){
            $(this).removeClass('hide');
            if(parseFloat($(this).find('.price').text()) > priceFilter){
                $(this).addClass('hide');
            }
        })
    }
});

$('#priceRange').on('change', function(){
    var price = parseFloat($('#priceRange').val());
    $('#rangeValue').text(price);
    var brandFilter = $('#filter').val();

    $('td.price').each(function(){
        // $(this).parent().show();
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
});
