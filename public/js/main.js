// var brandFilter;
// var price;
// var searchResultBackup;

$(document).ready(function() {
    // var searchResultBackup;

    $('#searchBtn').on('click', function(e){
        e.preventDefault()
        var searchText = {searchtext: $('input[name="searchtext"]').val()}
        if ($('input[name="searchtext"]').val() != ""){
            $.post('/', searchText, function(result){
                // console.log(result);
                if (result.searchResults.length < 1){
                    alert("No result matches.");
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
        } else {
            alert("Please type in the search content.");
        }
    });
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
    var rangeComponent = '<label for="priceRange" class="form-label">Price range</label>';
    rangeComponent += '<input type="range" class="form-range" id="priceRange" min="0" ' + 'max="' + max + '"' + '>';
    section.append(rangeComponent);
}


function changeFilter(){
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