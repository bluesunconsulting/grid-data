/**
 * Building the gridData object that is used to toggle between percent and dollars
 */
window.gridData = { // creates gridData as a global object
    months : {},
    expenses : {},
    categories : {},
    gridState :  {},
    monthParts : {},
    expParts : {},
    p4pParts : {},

    catParts : {},
    version : 1,
    cookiebasename : 'gridData',
    cookiename : '',
    children : [],

    /**
     * initial storage vars
     */
    init: function(){
        this.months = {current: {}, future: {}, default: 'D', state: 'D'};
        this.expenses = {current: {}, future: {}, default: 'P', state: 'P'};
        this.categories = {current: {}, future: {}, default: 'P', state: 'P'};
        this.gridState =  {months: 'Open', expenses: 'Open', p4p: 'Open', categories: 'Open'};
        this.cookiename = this.cookiebasename + this.version ;
        this.monthParts = $('tr .header.x-collapse');
        this.expParts = $('tr.row_title.x-expenses td.col_x_collapse');
        this.p4pParts = $('tr.row_title.x-p4p td.col_x_collapse');
        this.catParts = $('tr.row_title.x-categories td.col_x_collapse');
        return this;
    },


    /**
     * make various section collaspsable and attach events to handle it.
     */
    createCollapseSections : function (){
        console.log('Create Collapse Sections');
        var plusHTML = "<i class='fa fa-minus' title='Collapse Section'></i>" ;

        this.monthParts.html(plusHTML);
        this.expParts.html(plusHTML);
        this.p4pParts.html(plusHTML);
        this.catParts.html(plusHTML);

        grid = this;
        this.monthParts.off().on('click',function(){ grid.setuppart(grid.monthParts,'months','fast');});
        this.expParts.off().on('click',function(){ grid.setuppart(grid.expParts,'expenses','fast');});
        this.p4pParts.off().on('click',function(){ grid.setuppart(grid.p4pParts,'p4p','fast');});
        this.catParts.off().on('click',function(){ grid.setuppart(grid.catParts,'categories','fast');});
        this.getStateFromCookie();

        return this;

    },

    /**
     *   Toggle Grid Sections and Set Cookies to proper values
     */
    setuppart  :  function (part,togglename,speed){
        if(part.children('i').hasClass('fa-minus')){
            part.children('i')
                .addClass('fa-plus')
                .removeClass('fa-minus')
                .attr('title','Expand Section');
            if (togglename == 'months') {
                $('#current #datagrid th').addClass('hide');
                part.parent().children().removeClass('hide');

            } // fix for header row on current
            part.parent().children().addClass('hidetext');
            part.parent().children('.A').removeClass('hidetext');
            part.parent().children('.B').removeClass('hidetext');
            // console.log('function call closed ' + togglename);
            this.gridState[togglename] = 'Closed';
            // console.log(this.gridState);
            this.setStateToCookie();

        }
        else {
            part.children('i')
                .addClass('fa-minus')
                .removeClass('fa-plus')
                .attr('title','Collapse Section');
            if (togglename == 'months') { $('#current #datagrid th').removeClass('hide'); } // fix for header row on current
            part.parent().children().removeClass('hidetext');
            // console.log('Function Call OPEN '+ togglename);
            this.gridState[togglename] = 'Open';
            // console.log(this.gridState);
            this.setStateToCookie();
        }
        this.togglesection(togglename,speed);

        return this;
    },


    /**
     *   Use cookie values to display the grids either open or closed
     */
    restoreSectionState  :  function ()
    {
        console.log('Restore State Collapse Sections');

        if(typeof(this.gridState) != 'undefined') {
            if (this.gridState.months == 'Closed') {
                this.setuppart(this.monthParts, 'months', 0)
            }
            if (this.gridState.expenses == 'Closed') {
                this.setuppart(this.expParts, 'expenses', 0);
            }
            if (this.gridState.p4p == 'Closed') {
                this.setuppart(this.p4pParts, 'p4p', 0);
            }
            if (this.gridState.categories == 'Closed') {
                this.setuppart(this.catParts, 'categories', 0);
            }
        }
        return this;
    },


    /**
     *  used to toggle sections from shown to hide
     */
    togglesection   : function (sectionName,speed)
    {
        var timelimit = speed;
        switch(sectionName){
            case 'months':
                $('.row_month').toggle(timelimit);
                $('.row_total_month').toggle(timelimit);
                $('.row_key').toggle(timelimit);
                $('.row_other').toggle(timelimit);
                $('.row_total_months').toggle(timelimit);
                $('.row_bmkey').toggle(timelimit);
                $('.row_total_bup').toggle(timelimit);
                break;
            case 'expenses':
                $('.row_revenue').toggle(timelimit);
                $('.row_cogs').toggle(timelimit);
                $('.row_expense').toggle(timelimit);
                break;
            case 'p4p':
                $('.row_p4p').toggle(timelimit);
                break;
            case 'categories':
                $('.row_category').toggle(timelimit);
                $('.row_cat_total').toggle(timelimit);
                break;

        }
        return this;
    },


    /**
     *  Set Collaspible sections to either open or closed
     *  @param : {string} state string value that say if the sections should be all open or all closed
     */
    setAllSections : function(state){

        console.log('Set State Collapse Sections to ' + state);

        if(this.gridState.months != state) {
            this.setuppart(this.monthParts,'months','fast')
        }
        if(this.gridState.expenses != state) {
            this.setuppart(this.expParts,'expenses','fast');
        }
        if(this.gridState.p4p != state) {
            this.setuppart(this.p4pParts,'p4p','fast');
        }
        if(this.gridState.categories != state) {
            this.setuppart(this.catParts,'categories','fast');
        }

        this.gridState =  {
            months : state,
            expenses : state,
            p4p : state,
            categories: state
        };
        this.setStateToCookie();


        return this;

    },


    /**
     *  Gets the current state from the gridData cookie and sets the data to that value.
     *  if no cookie creates one with default values
     */
    getStateFromCookie : function () {
        var tmp_array = {};
        grid = this;
        if (typeof Cookies.get(grid.cookiename) == 'undefined') {
            tmp_array.months = grid.months.default;
            tmp_array.expenses = grid.expenses.default;
            tmp_array.categories = grid.categories.default;
            tmp_array.gridState =  {months: 'Open', expenses: 'Open', p4p: 'Open', categories: 'Open'};
            Cookies.set(grid.cookiename, tmp_array, {expires: 7});
        }
        else {
            tmp_array = Cookies.getJSON(grid.cookiename);
            Cookies.set(grid.cookiename, tmp_array, {expires: 7});
            grid.months.state = tmp_array.months;
            grid.expenses.state = tmp_array.expenses;
            grid.categories.state = tmp_array.categories;
            grid.gridState = tmp_array.gridState;

        }
        return this;
    },


    /**
     * Sets current state to the gridData cookie
     */
    setStateToCookie : function () {
        var tmp_array = {};
        tmp_array.months = this.months.state;
        tmp_array.expenses = this.expenses.state;
        tmp_array.categories = this.categories.state;
        tmp_array.gridState = this.gridState;
        Cookies.set(this.cookiename, tmp_array, {expires: 7});
        return this;
    },


    /**
     * sets the children based on an array of values
     * @param {array} val array of children
     */
    setChildren : function (val) {
        // used to correct for illegal characters
        $.each(val, function (index, item) {
            val[index] = String(item).replace(/\W/g, '_');
        });
        this.children = val;
        return this;
    },


    /**
     * converts a value to a number
     * @param {string|number} tStr value to convert
     * @return {string|number}
     */
    numberize : function (tStr) {
        if (typeof tStr != 'undefined') {
            if (isNaN(tStr)) {
                return Number(tStr.replace(/[^0-9\.\-]+/g, ""));
            } else {
                return tStr;
            }
        }
    },


    /**
     * Create a percent value to 2 decimal places
     * @param {float} lower - numerator number
     * @param {float} higher - denomantor number
     * @return {string} percent value
     */
    percenticate : function (lower, higher) {
        var val = (lower / higher * 100).toFixed(2);
        if (val == 'NaN') {
            return '';
        }
        return val + "%";
    },


    /**
     * convert number to string with dollar sign and commas
     * @param {int} val - number to convert
     * @return {string} - dollarized value
     */
    dollarize : function (val) {
        var nStr = String(Math.round(parseFloat(val)));
        var rgx = /(\d+)(\d{3})/;

        while (rgx.test(nStr)) {
            nStr = nStr.replace(rgx, '$1' + ',' + '$2');
        }
        if (nStr == 'NaN') {
            return '';
        }
        return '$' + nStr;
    },


    /**
     * Gets all the month child row data and loads both percent and dollar values
     */
    getMonthData : function (choice) {
        var rows = {};
        var totals = {};
        grid = this;
        var tmpObj = this.clone(this.children);
        if (choice == 'current') {
            tmpObj.push('revenue');
            tmpObj.push('f_revenue');
            //tmpObj.push('diff');
        }
        $.each(tmpObj, function (childIndex, childData) {
            // totals[childData] = grid.numberize($('div#' + choice + ' tr.row_total_months td.col_' + childData).html());
            totals[childData] = numberize($('div#' + choice + ' tr.row_total_months td.col_' + childData).html());
            totals[childData] = totals[childData] == 0 ? '' : totals[childData];
        });

        $('tr.row_month').each(function (rowIndex, rowData) {
            var row_id = rowData.dataset.row;
            //var row_total = gridData.numberize($('.col_c_total._'+row_id).html());
            rows[row_id] = {};
            $.each(tmpObj, function (childIndex, childData) {
                var tmp_val = $('div#' + choice + '  .col_' + childData + '._' + row_id).html();
                if (typeof tmp_val == 'undefined') {
                    tmp_val = '';
                }
                // var tmp_per = tmp_val == '' ? '' : grid.percenticate(grid.numberize(tmp_val), totals[childData]);
                var tmp_per = tmp_val == '' ? '' : percenticate(numberize(tmp_val), totals[childData], false, false);

                rows[row_id][childData] = {};
                rows[row_id][childData]['dollar'] = tmp_val;
                rows[row_id][childData]['percent'] = tmp_per;
            });
        });

        ttmDiff = 0;
        if (choice == 'current') {
            $.each(rows, function(row_id,row_data)
            {
                ttmDiff = $('div#' + choice + ' td.col_diff._' + row_id).html();
                row_data.diff = {} ;
                row_data.diff.dollar = ttmDiff;

                if(ttmDiff != ''){

                    // myDiff = ( grid.numberize(row_data.revenue.dollar) / grid.numberize(row_data.f_revenue.dollar) ) - 1;
                    myDiff = ( numberize(row_data.revenue.dollar) / numberize(row_data.f_revenue.dollar) ) - 1;
                    row_data.diff.percent = (myDiff * 100).toFixed(2) + "%";
                }
                else
                {
                    row_data.diff.percent = '';
                }
            });
        }



        if (choice == 'current') {
            grid.months.current.rows = rows;
        }
        else {
            grid.months.future.rows = rows;

        }
        return this;
    },


    /**
     * Gets all the expense child row data and loads both percent and dollar values
     */
    getExpenseData : function (choice) {
        var rows = {};
        var totals = {};
        grid = this;
        var tmpObj = this.clone(this.children);
        if (choice == 'current') {
            tmpObj.push('revenue');
            tmpObj.push('f_revenue');
            //tmpObj.push('diff');
        }

        $.each(tmpObj, function (rowIndex, rowData) {
            // totals[rowData] = grid.numberize($('div#' + choice + '  tr.row_revenue td.col_' + rowData).html());
            totals[rowData] = numberize($('div#' + choice + '  tr.row_revenue td.col_' + rowData).html());
            totals[rowData] = totals[rowData] == 0 ? '' : totals[rowData];
        });


        $('div#' + choice + '  tr.row_cogs').each(function (index, rowData) {
            var row_id = rowData.dataset.row;
            rows[row_id] = {};
            $.each(tmpObj, function (childKey, child) {
                var tmp_per = $('div#' + choice + '  .col_' + child + '._' + row_id).html();
                if (typeof tmp_per == 'undefined') {
                    tmp_per = '';
                }
                // var tmp_val = tmp_per.trim() == '' ? '' : grid.dollarize(totals[child] * Number(tmp_per.replace('%', '')) / 100);
                var tmp_val = tmp_per.trim() == '' ? '' : dollarize(totals[child] * Number(tmp_per.replace('%', '')) / 100);

                rows[row_id][child] = {};
                rows[row_id][child]['dollar'] = tmp_val;
                rows[row_id][child]['percent'] = tmp_per;
            });
        });

        $('div#' + choice + '  tr.row_expense').each(function (rowIndex, rowData) {
            var row_id = rowData.dataset.row;
            rows[row_id] = {};
            $.each(tmpObj, function (childIndex, childData) {
                var tmp_per = $('div#' + choice + '  .col_' + childData + '._' + row_id).html();
                if (typeof tmp_per == 'undefined') {
                    tmp_per = '';
                }
                // var tmp_val = tmp_per.trim() == '' ? '' : grid.dollarize(totals[childData] * Number(tmp_per.replace('%', '')) / 100);
                var tmp_val = tmp_per.trim() == '' ? '' : dollarize(totals[childData] * Number(tmp_per.replace('%', '')) / 100);

                rows[row_id][childData] = {};
                rows[row_id][childData]['dollar'] = tmp_val;
                rows[row_id][childData]['percent'] = tmp_per;
            });
        });

        ttmDiff = 0;

        if (choice == 'current') {
            $.each(rows, function(row_id,row_data)
            {
                ttmDiff = $('div#' + choice + ' td.col_diff._' + row_id).html();
                row_data.diff = {} ;
                row_data.diff.percent = ttmDiff;
                if(ttmDiff != ''){
                    // myDiff = grid.numberize(row_data.revenue.dollar) - grid.numberize(row_data.f_revenue.dollar);
                    myDiff = numberize(row_data.revenue.dollar) - numberize(row_data.f_revenue.dollar);
                    // row_data.diff.dollar = grid.dollarize(myDiff);
                    row_data.diff.dollar = dollarize(myDiff);
                }
                else
                {
                    row_data.diff.dollar = '';
                }
            });
        }

        if (choice == 'current') {
            grid.expenses.current.rows = rows;
        }
        else {
            grid.expenses.future.rows = rows;

        }

        return this;
    },


    /**
     * Gets all the category child row data and loads both percent and dollar values
     */
    getCategoryData : function (choice) {
        var rows = {};
        var totals = {};
        grid = this;
        var tmpObj = this.clone(this.children);
        if (choice == 'current') {
            tmpObj.push('revenue');
            tmpObj.push('f_revenue');
            //tmpObj.push('diff');
        }

        $.each(tmpObj, function (childIndex, childData) {
            // totals[childData] = grid.numberize($('div#' + choice + '  tr.row_cat_total td.col_' + childData).html());
            totals[childData] = numberize($('div#' + choice + '  tr.row_cat_total td.col_' + childData).html());
            totals[childData] = totals[childData] == 0 ? '' : totals[childData];
        });


        $('div#' + choice + '  tr.row_category').each(function (rowIndex, rowData) {
            var row_id = rowData.dataset.row;
            rows[row_id] = {};
            $.each(tmpObj, function (childIndex, childData) {
                var tmp_per = $('div#' + choice + '  .col_' + childData + '._' + row_id).html();
                if (typeof tmp_per == 'undefined') {
                    tmp_per = '';
                }
                // var tmp_val = tmp_per.trim() == '' ? '' : grid.dollarize(totals[childData] * Number(tmp_per.replace('%', '')) / 100);
                var tmp_val = tmp_per.trim() == '' ? '' : dollarize(totals[childData] * Number(tmp_per.replace('%', '')) / 100);

                rows[row_id][childData] = {};
                rows[row_id][childData]['dollar'] = tmp_val;
                rows[row_id][childData]['percent'] = tmp_per;
            });
        });

        ttmDiff = 0;

        if (choice == 'current') {
            $.each(rows, function(row_id,row_data)
            {
                ttmDiff = $('div#' + choice + ' td.col_diff._' + row_id).html();
                row_data.diff = {} ;
                row_data.diff.percent = ttmDiff;
                if(ttmDiff != ''){
                    // myDiff = grid.numberize(row_data.revenue.dollar) - grid.numberize(row_data.f_revenue.dollar);
                    myDiff = numberize(row_data.revenue.dollar) - numberize(row_data.f_revenue.dollar);
                    // row_data.diff.dollar = grid.dollarize(myDiff);
                    row_data.diff.dollar = dollarize(myDiff);
                }
                else
                {
                    row_data.diff.dollar = '';
                }
            });
        }

        if (choice == 'current') {
            grid.categories.current.rows = rows;
        }
        else {
            grid.categories.future.rows = rows;

        }
        return this;
    },


    /**
     * Calls all the sub-get functions to generate data
     */
    getData : function () {
        //return this;
        this
            .getCategoryData('future')
            .getMonthData('future')
            .getExpenseData('future')
            .getCategoryData('current')
            .getMonthData('current')
            .getExpenseData('current');

        return this;
    },


    /**
     * Switches the data from one value to another
     * @param {object} val - the collection of data for a section
     */
    switch : function (val) {
        if (val.state == 'D') {
            this.setType(val, 'P');
        }
        else {
            this.setType(val, 'D');
        }
        return this;
    },


    /**
     * Switches all areas to the other type of display
     */
    switchAll : function () {
        this
            .switch(this.months)
            .switch(this.expenses)
            .switch(this.categories);

        return this;
    },


    /**
     * Sets an area to display a certain value type
     * @param {object} val - area object to display data from
     * @param {string} type - D for Dollars , P for Percent
     */
    setType : function (val, type) {

        val.state = type == 'D' ? 'D' : 'P';
//    var childrenArray = this.clone(this.children);
        $.each(val.current.rows, function (row_id, data) {
            $.each(data, function (item2, celldata) {
                if (val.state == 'P') {
                    $('div#current .col_' + item2 + '._' + row_id)
                        .html(celldata['percent'])
                        .attr('title','Amount: ' + celldata['dollar'] + " \nPercent: " + celldata['percent']);

                }
                else {
                    $('div#current .col_' + item2 + '._' + row_id)
                        .html(celldata['dollar'])
                        .attr('title','Amount: ' + celldata['dollar'] + " \nPercent: " + celldata['percent']);

                }
            });
        });

        $.each(val.future.rows, function (row_id, data) {
            $.each(data, function (item2, celldata) {
                if (val.state == 'P') {
                    $('div#future .col_' + item2 + '._' + row_id)
                        .html(celldata['percent'])
                        .attr('title','Amount: ' + celldata['dollar'] + " \nPercent: " + celldata['percent']);
                }
                else {
                    $('div#future .col_' + item2 + '._' + row_id)
                        .html(celldata['dollar'])
                        .attr('title','Amount: ' + celldata['dollar'] + " \nPercent: " + celldata['percent']);
                }
            });
        });

        this.setStateToCookie();
        return this;
    },


    /**
     * Set display area to it's default type
     * @param {object} val - area object to display data from
     */
    setDefault : function (val) {
        this.setType(val, val.default);
        return this;
    },


    /**
     * Set display area to last selected type
     */
    setToSelected : function () {
        $('.expenses.' + this.expenses.state).prop('checked', true);
        $('.categories.' + this.categories.state).prop('checked', true);
        $('.months.' + this.months.state).prop('checked', true);

        this
            .setType(this.categories, this.categories.state)
            .setType(this.expenses, this.expenses.state)
            .setType(this.months, this.months.state);


        return this;
    },


    /**
     * reset all areas to their display defaults
     */
    resetAll : function () {
        console.log('resetAll');
        $('.expenses.' + this.expenses.default).prop('checked', true);
        $('.months.' + this.months.default).prop('checked', true);
        $('.categories.' + this.categories.default).prop('checked', true);

        this
            .setDefault(this.months)
            .setDefault(this.expenses)
            .setDefault(this.categories);

        return this;

    },


    /**
     * Used to clone an object
     * @param obj
     * @returns {*} a cloned object
     */
    clone : function (obj) {

        if (obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj) {
            return obj;
        }

        if (obj instanceof Date) {
            var temp = new obj.constructor(); //or new Date(obj);
        }
        else {
            var temp = obj.constructor();
        }

        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                obj['isActiveClone'] = null;
                temp[key] = this.clone(obj[key]);
                delete obj['isActiveClone'];
            }
        }
        return temp;
    }

};
// END of gridData object


