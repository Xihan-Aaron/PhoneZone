// var brandFilter;
// var price;

$(document).ready(function() {
    $('#searchBtn').on('click', function(e){
        e.preventDefault()
        var searchText = {searchtext: $('input[name="searchtext"]').val()}
        $.post('/', searchText, function(result){
            if (result.searchResults.length > 0){
                viewSearch(result.searchResults);
                addDropDown(result.searchResults);
                addRange(result.searchResults);
                $('#soldOutSoon').remove();
                $('#bestSellers').remove();
            }
            $('#filter').on('change', function(e){
                var brandFilter = $('#filter').val();
                $('tr.searchItem').show();

                if(brandFilter != 'All'){
                    var brandList = $('#filter option')
                    var exceptList = [];
                    // console.log(brandList[1].val());
                    for(var i = 0; i < brandList.length; i++){
                       if(brandList[i].innerText != brandFilter && brandList[i].innerText != 'All'){
                           exceptList.push(brandList[i].innerText);
                       }
                    }
                    // console.log(exceptList);
                    for(var i = 0; i < exceptList.length; i++){
                       $('.' + exceptList[i]).hide();
                    }
                }
            });
            $('#priceRange').on('change', function(e){
                var price = parseFloat($('#priceRange').val());
                console.log("Current threshold: " + price.toString());

                $('td.price').each(function(){
                    $(this).parent().show();
                    // console.log(parseFloat($(this).text()));
                    if (parseFloat($(this).text()) > price){
                        $(this).parent().hide();
                    }
                });
                $('#filter').children()[0].remove();
                $('#filter').prepend('<option selected>All</option>');
            });
            

        });
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
        tableRow += '<td><img src=' + result[i].image + ' alt="" class="thumbnail"></td>';
        tableRow += '<td class="title">' + result[i].title + '</td>';
        tableRow += '<td class="brand">' + result[i].brand + '</td>';
        tableRow += '<td class="price">' + result[i].price + '</td>';
        tableRow += '<td class="stock">' + result[i].stock + '</td>';
        tableRow += '</tr>';
        tableBody += tableRow;
    }
    tableBody += '</tbody>';
    table += tableTitle + tableBody + '</table>'
    var tableDiv = '<div class="table-responsive">' + table + '</div>'
    searchSection.append(tableDiv)
}

function addDropDown(result){
    var brandList = [result[0].brand];
    for(var i = 1; i < result.length; i++){
        if (!brandList.includes(result[i].brand)){
            brandList.push(result[i].brand);
        }
    }
    brandList.sort();
    // console.log(brandList);
    var section = $('#searchFilter');
    section.empty();
    // var filterList = '<li class="dropdown">';
    var filterList = '<select id="filter" class="navbar-form navbar-left">';
    filterList += '<option>All</option>'
    for(var i = 0; i < brandList.length; i++){
        filterList += '<option>' + brandList[i] + '</option>';
    }
    
    filterList += '</select>';
    // filterList += '</li>';
    section.append(filterList);
    // console.log(filterList);
}

function addRange(result){
    var priceList = [];
    for(var i = 0; i < result.length; i++){
        priceList.push(result[i].price);
    }
    var max = Math.max(...priceList);
    console.log(max);
    var section = $('#searchRange');
    section.empty();
    var rangeComponent = '<label for="priceRange" class="form-label">Price range</label>';
    rangeComponent += '<input type="range" class="form-range" id="priceRange" min="0" ' + 'max="' + max + '"' + '>';
    section.append(rangeComponent);
}