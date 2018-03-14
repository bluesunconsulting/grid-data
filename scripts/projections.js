$(function() {

    setupGrid();
});

var children = [6,14,16,33,43,53,116,191];  // normally this would be dynamically generated.


function setupGrid(){
    gridData
        .init()
        .setChildren(children)
        .getData()
        .getStateFromCookie()
        .setToSelected()
        .createCollapseSections()
        .restoreSectionState();


    setupSlideout();

    //attach events to radio buttons in slider
    $('.expenses').on('click', function(){
        gridData.setType(gridData.expenses,this.value);
    });
    $('.months').on('click', function(){
        gridData.setType(gridData.months,this.value);
    });
    $('.categories').on('click', function(){
        gridData.setType(gridData.categories,this.value);
    });
    $('#reset_display').on('click', function(){
        gridData.resetAll();
    });
    $('#collaspseSections').off().on('click', function() {
        gridData.setAllSections('Closed');
    });
    $('#expandSections').off().on('click', function() {
        gridData.setAllSections('Open');
    });

}




function setupSlideout()
{
    console.log('setupSlideout');
    $('#slideout').removeClass('hide');
    $('#slideout').removeClass('slideoutShort');

    // Assign event to sliderPanel Toggle
    $('#toggle_icon')
        .off()
        .on('click', toggleslideout);
}

/**
 * Toggles slideout panel
 */
function toggleslideout() {
    $('#slideout').toggleClass('on');
    var tmp_value = $('#toggle_icon');
    if (tmp_value.hasClass('fa-angle-double-left')) {
        tmp_value
            .removeClass('fa-angle-double-left')
            .addClass('fa-angle-double-right')
            .attr('title', 'Close Display Options');

    } else {
        tmp_value
            .removeClass('fa-angle-double-right')
            .addClass('fa-angle-double-left')
            .attr('title', 'Open Display Options');
    }
}



/**
 * Adds the class for sticky highlighting a row
 */
function stickyHighlight()
{
    console.log('stickyHighlight');
    $('tr').removeClass('highlight');
    $(this).addClass('highlight');
    $('.add').removeClass('highlight');
    $('.delete').removeClass('highlight');

    var customerId = $(this).attr('class').match(/id_\S*/);           //identifier - 'id_12345'
    if(customerId !== null) {
        $('.' + customerId).addClass('highlight');
    }
}


/**
 * format a string with uppercase words
 * @param str
 * @returns {string|String}
 */
function ucwords (str) {
    return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
    });
}


/**
 * format a string to a common dollar format
 * @param val incoming value to be formatted
 * @param round optional value to round to (10,100,1000,etc)
 * @returns {string}
 */
function dollarize(val, round)
{
    if(typeof round == 'undefined') {
        round = 1000;
    }
    //round the incoming value to nearest thousands
    var nStr = String(Math.round(parseFloat(val) / round) * round);
    var rgx = /(\d+)(\d{3})/;

    while (rgx.test(nStr)) {
        nStr = nStr.replace(rgx, '$1' + ',' + '$2');
    }

    return '$' + nStr;
}


/**
 * return a number from a string of number characters
 * @param tStr
 * @returns {*}
 */
function numberize(tStr)
{
    if(typeof tStr !== 'undefined') {

        // if (isNaN(tStr)) {
        return Number(tStr.replace(/[^0-9\.\-]+/g, ""));
        // } else {
        //     console.log('string returned');
        //     return tStr;
        // }
    }
}


/**
 * find a percentage, and then return a common percentage format
 * @param numerator
 * @param denominator = undefined to round & return a percentage
 * @param growth  = true if this percentage is the amount of growth
 * @param number  = true if a number should be returned
 * @param roundAmount = number of places to have after decimal. Defaults to 2
 * @returns {string}
 */
function percenticate(numerator, denominator, growth, number, roundAmount)
{
    var val = 0;
    if(typeof roundAmount === 'undefined') {
        roundAmount = 2;
    }
    denominator = denominator !== 0 ? denominator : .01;

    if(typeof denominator === 'undefined') {
        val = numerator.toFixed(roundAmount);
        // return numerator.toFixed(2) + '%';
    } else if(growth === true) {
        val = ((numerator / denominator - 1) * 100).toFixed(roundAmount);
        // return ((numerator / denominator - 1) * 100).toFixed(2) + '%';
    } else {
        val = (numerator / denominator * 100).toFixed(roundAmount);
    }

    if(number === true) {
        return Number(val);
    } else {
        return val + '%';
    }
}


    // Popup window code
    function newPopup(file) {

    url = "view_source.php?file="+file;
        popupWindow = window.open(
            url,'popUpWindow','height=400,width=800,left=10,top=10,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes')
    }


