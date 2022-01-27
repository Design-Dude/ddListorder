/* list order class */
ddListorder = new function () {
    this.version = "1.0.0"; // major . minor . small
    this.info = { // Please, be respectful. Thank you!
        version: this.version,
        library: "listorder.js",
        owner: "Design Dude",
        year: "2022",
        developer: "Mek van 't Hoff",
        contact: "master.mek@design-dude.nl"
    }
    // setup
    this.loc = "listorder v" + this.version;
    this.busy = false;
    this.instance = 0;
    this.name = [];
    this.rowDrag = [];
    this.singleDrag = [];
    this.function = [];
    this.rows = {
        source: false,
        clone: false
    };
    this.clickevent = false;
    this.location = {
        x: 0,
        y: 0,
        posY: false,
        row: false
    };
    this.data = false;
    this.update_table = function () {
        var that = this;
        // get instance
        var instance = that.rows.source.closest('table[listorder-instance]').attr('listorder-instance');
        // unhide children
        that.rows.source.children().css("opacity", 1);
        // remove clone
        that.rows.clone.remove();
        that.rows.clone = false;
        that.busy = false;
        // reorder all row index
        var i = 0;
        var returnType = typeof (that.data.returnType) === 'string' ? that.data.returnType : 'json';
        var returnData = returnType === 'json' ? { table: that.name[instance - 1], data: [] } : [];
        if (that.singleDrag[instance - 1] && returnType === 'json') {
            returnData['logic'] = {
                id: that.rows.source.attr('listorder-id'),
                from: parseInt(that.rows.source.attr('listorder-order')),
                to: parseInt(that.rows.source.attr('listorder-index')),
                shift: parseInt(that.rows.source.attr('listorder-index')) > parseInt(that.rows.source.attr('listorder-order')) ? -1 : parseInt(that.rows.source.attr('listorder-index')) < parseInt(that.rows.source.attr('listorder-order')) ? 1 : 0
            }
        }
        // collect data
        that.rows.source.parent().children().each(function (index) {
            if (typeof ($(this).attr('listorder-index')) !== 'undefined' && !$(this).hasClass('listorder_clone')) {
                i++;
                $(this).attr('listorder-index', i);
                if (returnType === 'json') {
                    returnData['data'].push({
                        id: $(this).attr('listorder-id'),
                        from: parseInt($(this).attr('listorder-order')),
                        to: parseInt($(this).attr('listorder-index'))
                    });
                } else {
                    returnData[$(this).attr('listorder-order')] = $(this).attr('listorder-index');
                }
            }
        });
        if (that.singleDrag[instance - 1]) {
            that.rows.source.parent().children().each(function (index) {
                $(this).attr('listorder-order', $(this).attr('listorder-index'));
            });
        }
        if (typeof (that.function[instance - 1]) === 'function') {
            if (returnType === 'json') {
                /*
                for (var d in that.data) {
                    if (d.indexOf(['data', 'table', 'change', 'returnType', 'enable', 'rowDrag', 'singleDrag']) > -1) {
                        returnData[d] = that.data[d];
                    }
                }
                */
            } else {
                var td = [];
                for (var d in returnData) {
                    td.push(returnData[d]);
                }
                returnData = td;
            }
            var func = that.function[instance - 1];
            func(returnData);
        }
        // restore click event after leaving
        setTimeout(function (source) {
            source.attr("onclick", that.clickevent);
            source = false;
        }, 100, that.rows.source);
    }
    this.wait = function (b) {
        if (typeof (b) !== 'undefined' && !b) {
            this.busy = false;
            $('table').each(function () {
                $(this).removeClass('listorder-busy').addClass('listorder-enabled');
            });
        } else {
            this.busy = true;
            $('table').each(function () {
                $(this).removeClass('listorder-enabled').addClass('listorder-busy');
            });
        }
    }
    this.init = function (data) {
        var that = this;
        var table = false;
        that.instance++;
        that.rowDrag.push(typeof (data.rowDrag) === 'undefind' || !data.rowDrag ? false : true);
        that.singleDrag.push(typeof (data.singleDrag) === 'undefind' || !data.singleDrag ? false : true);
        // do we have a table definition
        if (typeof (data) === 'object') {
            if (typeof (data.table) === 'string') {
                data.table = {
                    id: data.table
                }
            }
            if (typeof (data.table) === 'object' && Object.keys(data.table).length === 1) {
                for (var k in data.table) {
                    table = $('table[' + k + '=' + data.table[k] + ']');
                    that.name[that.instance - 1] = data.table[k];
                }
            }
            // store return function
            if (typeof (data.change) === 'function') {
                that.function.push(data.change);
            }
            // use data instead to find table
            if (typeof (data.data) === 'object' && typeof (data.data.rows) === 'object' && Object.keys(data.data.rows).length >= 1) {
                var listordertable = false;
                if (table) {
                    table.attr('listorder', "true");
                    table.addClass('listorder');
                    listordertable = table;
                }
                var regex = typeof (data.data.regex) === 'string' ? data.data.regex : false;
                var attr = typeof (data.data.attr) === 'string' ? data.data.attr : "id";
                var body = typeof (data.data.body) === 'string' ? data.data.body : "tbody>tr";
                var row_index = 0;
                for (var d in data.data.rows) {
                    $(body + '[' + attr + ']').each(function (index) {
                        var r = regex ? regex.replace("[rows]", data.data.rows[d]) : data.data.rows[d];
                        var match = new RegExp(r, 'g');
                        if (match.test($(this).attr(attr))) {
                            table = $(this).closest('table');
                            if (!$(this).attr('listorder-id') && (!listordertable || listordertable.attr('listorder') == "true")) {
                                $(this).attr('listorder-id', data.data.rows[d]);
                                row_index++;
                                $(this).attr('listorder-order', row_index);
                                if (!listordertable) {
                                    table.attr('listorder', "true");
                                    table.addClass('listorder');
                                    listordertable = table;
                                }
                            }
                        }
                    });
                }
            } else if (table && (typeof (data.data) === 'undefined' || typeof (data.data.rows) === 'undefined')) {
                table.attr('listorder', "true");
                table.addClass('listorder');
                // or use table rows to fill missing data
                data.data = typeof (data.data) === 'object' ? data.data : {};
                data.data.attr = typeof (data.data.attr) === 'string' ? data.data.attr : "id";
                data.data.regex = typeof (data.data.regex) === 'string' ? data.data.regex : false;
                data.data.body = typeof (data.data.body) === 'string' ? data.data.body : "tbody>tr";
                data.data.rows = typeof (data.data.rows) === 'object' ? data.data.rows : [];
                var row_index = 0;
                table.find(data.data.body + '[' + data.data.attr + ']').each(function (i) {
                    var match = data.data.regex ? new RegExp(data.data.regex, 'g') : false;
                    var found = match ? $(this).attr(data.data.attr).match(match) : [$(this).attr(data.data.attr)];
                    if (found.length) {
                        data.data.rows.push(found[0]);
                        $(this).attr('listorder-id', found[0]);
                        row_index++;
                        $(this).attr('listorder-order', row_index);
                    }
                });
            } else {
                console.log(that.loc, 'Table definition incorrect');
            }
            // finally see if selected column is sorted with correct attr or class
            if (typeof (data.enable) === 'object') {
                var attr = typeof (data.enable.attr) === 'string' ? data.enable.attr : false;
                var enable = typeof (data.enable.enable) === 'string' ? data.enable.enable : false;
                var disable = typeof (data.enable.disable) === 'string' ? data.enable.disable : false;
                var head = typeof (data.enable.head) === 'string' ? data.enable.head : "thead>tr>th";
                var column = typeof (data.enable.column) !== 'undefined' ? parseInt(data.enable.column) : 0;
                if (attr === false || enable === false || disable === false || !column) {
                    table.addClass('listorder-enabled');
                } else {
                    var listorderenable = true;
                    table.find(head).each(function (index) {
                        if ((column !== index + 1 && $(this).attr(attr).indexOf(enable) > -1) || $(this).attr(attr).indexOf(disable) > -1) {
                            listorderenable = false;
                        };
                    });
                    if (listorderenable) table.addClass('listorder-enabled');
                }
            } else if (table) {
                table.addClass('listorder-enabled');
            }
        } else {
            console.log(that.loc, 'No table definition');
        }
        // store data
        that.data = data;
        // do we have a single table object
        if (table.length === 1) {
            if (typeof (table.attr('id')) === 'undefined') {
                table.attr('id', 'listorder_' + that.instance);
            }
            if (!that.name[that.instance - 1]) {
                that.name[that.instance - 1] = table.attr('id');
            }
            table.attr('listorder-instance', that.instance);
            // add draggers to first cell of table-rows
            table.find('tr[listorder-id]>td:first-child').each(function (index) {
                // make inline table
                $(this).find('>table').css('display', 'inline-table');
                // set initial row index
                $(this).parent().attr('listorder-index', (index + 1));
                // add inline div to the left
                var moveicon = $('<div class="listorder-icon"></div>');
                moveicon.css('display', 'inline-block');
                // add events
                if (table.hasClass('listorder-enabled')) {
                    var dragable = that.rowDrag[that.instance - 1] ? $(this).closest('tr[listorder-index]') : moveicon;
                    if (that.rowDrag[that.instance - 1]) {
                        table.addClass('listorder-dragrow');
                    }
                    dragable.bind('mousedown', { instance: that, nr: that.instance }, function (e) {
                        if (e.stopPropagation) e.stopPropagation();
                        if (e.preventDefault) e.preventDefault();
                        e.cancelBubble = true;
                        e.returnValue = false;
                        var that = e.data.instance;
                        if (!that.busy) {
                            that.rows.source = $(e.target).closest('tr[listorder-index]');
                            // make clone of the row
                            that.rows.clone = that.rows.source.clone();
                            that.rows.clone.addClass('listorder_clone');
                            that.rows.clone.attr('listorder_table_instance', e.data.nr);
                            // set width of each cell to original
                            that.rows.clone.css('width', that.rows.source.width());
                            that.rows.source.find('>td').each(function (index) {
                                that.rows.clone.find('>td').eq(index).css('width', $(this).width());
                            });
                            // store top and left delta from cursor
                            that.location.x = e.pageX - that.rows.source.position().left;
                            that.location.y = e.pageY - that.rows.source.position().top;
                            that.location.posY = e.pageY;
                            that.rows.clone.css('position', 'absolute');
                            that.rows.clone.css('left', e.pageX - that.location.x);
                            that.rows.clone.css('top', e.pageY - that.location.y);
                            // insert clone
                            that.rows.source.after(that.rows.clone);
                            // hide children
                            that.rows.source.children().css("opacity", 0.1);
                            that.location.row = $(e.target).closest('tr[listorder-index]').attr('listorder-index');
                            e.data.instance.busy = true;
                            // override clickevent
                            e.data.instance.clickevent = $(e.target).closest('tr[listorder-index]').attr('onclick');
                            $(e.target).closest('tr[listorder-index]').attr('onclick', '');
                        }
                        return false;
                    });
                    $(this).closest('tr[listorder-index]').bind('mouseover', { instance: that, nr: that.instance }, function (e) {
                        var that = e.data.instance;
                        if (that.busy && that.rows.source !== false) {
                            var myTableInstance = that.rows.source.closest('table[listorder-instance]').attr('listorder-instance');
                            if (myTableInstance == e.data.nr) {
                                var rowid = $(e.target).closest('tr[listorder-index]').attr('listorder-index');
                                if (that.location.row !== rowid) {
                                    that.location.row = rowid;
                                    if (that.location.row !== that.rows.source.attr('listorder-index')) {
                                        if (parseInt(that.location.row) < parseInt(that.rows.source.attr('listorder-index'))) {
                                            $(e.target).closest('tr[listorder-index]').before(that.rows.source);
                                        } else if (parseInt(that.location.row) > parseInt(that.rows.source.attr('listorder-index'))) {
                                            $(e.target).closest('tr[listorder-index]').after(that.rows.source);
                                        }
                                    }
                                }
                                // reorder all rows
                                var i = 0;
                                $(e.target).closest('tr[listorder-index]').parent().children().each(function (index) {
                                    if (typeof ($(this).attr('listorder-index')) !== 'undefined' && !$(this).hasClass('listorder_clone')) {
                                        i++;
                                        $(this).attr('listorder-index', i);
                                    }
                                });
                            }
                        }
                    });
                    $(this).parent().closest('tr[listorder-index]').bind('mouseup', { instance: that }, function (e) {
                        var that = e.data.instance;
                        if (that.busy) {
                            // update table
                            that.update_table();
                            return false;
                        } else {
                            return true;
                        }
                    });
                }
                // add button to list
                moveicon.prependTo($(this));
            });
            // document event to handle mouseup for this instance
            if (table.hasClass('listorder-enabled')) {
                $(document).bind('mousemove mouseup', { instance: this }, function (e) {
                    var that = e.data.instance;
                    if (that.busy && that.rows.clone !== false) {
                        switch (e.type) {
                            case 'mouseup':
                                // update table
                                that.update_table();
                                return false;
                                break;
                            case 'mousemove':
                                // is the mouse moving up or down
                                // todo: use to prevent flickering when row heights differ
                                if (that.location.posY > e.pageY) {
                                    //console.log('up')
                                } else if (that.location.posY < e.pageY) {
                                    //console.log('down')
                                }
                                that.location.posY = e.pageY;
                                // move clone to mouse position
                                that.rows.clone.css('left', e.pageX - that.location.x);
                                that.rows.clone.css('top', e.pageY - that.location.y);
                                return true;
                                break;
                            default:
                                return true;
                                break;
                        }
                    }
                });
            }
        } else {
            console.log(that.loc, 'No table found');
        }
    }
}