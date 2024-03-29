# ddListorder
Small and simple javascript library for manipulating rows in a predefined table on desktop and as of version 1.1.0 on mobile devices.

Initiate ```ddListorder``` with any given table and all selected rows can be reordered by drag & drop. Pass a return function and handle the drop change at your will, updating internal arrays, input fileds or a database.

## On the  whislist (known issue)
- Move only over y axis (within table)
- Drag any item to any dropzone (perhaps different class)

## Dependencies
```jQuery```

## Installation
Download the latest version ```ddListorder.js``` or ```ddListorder.min.js``` and include the file in your project.
```
<script type='text/javascript' src='ddListorder.min.js'></script>
```
Or link ```ddListorder``` from design-dude.nl. This will always be the latest version.
```
<script type='text/javascript' src='https://www.design-dude.nl/classes/ddListorder.min.js'></script>
```

## Constructor
```ddListorder.init( { options=json } );```
Call ```ddListorder``` and provide the necessary options for the table.

## Properties
After initialisation the following information properties will be available.
```
ddListorder.version; // version
ddListorder.info; // meta information
```

## Options properties
#### table
Specify the table by passing a table ID as string or object. The table definition is optional. Without the ```table:``` option there must be a ```data.rows``` array (see below) with unique row IDs to find the table.
```
table: "my_table_id"

table: { id: "my_table_id" }
```
- If ```ddListorder``` finds a table using the row IDs of ```data.rows```, the table gets an automated ID like ```id="listorder_" + instance counter ``` if it does not have its own id.
- The key ```id:``` may be any table attribute from the DOM where the actual ID is located. For instance ```table: { data-id:"my_table_id" }``` will look for attribute ```data-id="my_table_id"```.

#### data
Pass the list of row IDs or tell ```ddListorder``` where to find them in the specified table. Without ```rows:``` you must specifiy ```table:```.
```
data: {
    rows: ["row_id_1", ... ]
}

data: {
    attr: "id",
    regex: "pattern"
}

data: {
    attr: "id",
    body: "tbody>tr",
    regex: "my_table_id_[rows]",
    rows: ["row_id_1", "row_id_2", "row_id_3", "row_id_4", ... ]
}
```
- Use ```attr:``` if the row IDs are stored in another attribute than ```id```, which is default.
- Use ```body:``` if the rows are not in ```tbody>tr```, which is default.
- Use ```regex:``` to get the row ID as a part of ```attr:``` if ```rows:``` is not defined.
- Use ```regex:``` to test if the row ID's are part of ```attr:```. ```[rows]``` is a placeholder for the individual IDs in ```rows:```.

#### change
A function that should handle the feedback on a drag change.
```
change: function_name

change: function( return_object ) {
    // console.log( return_object );
    // handle drag & drop response here
}
```
The ```return_object``` is in ```json``` format.
```
data: [{id: "row_id_1", from: 3, to: 1}, {id: "row_id_2", from: 2, to: 2}, {id: "row_id_3", from: 1, to: 3}, {id: "row_id_4", from: 4, to: 4}]
logic: {id: "row_id_2", from: 3, to: 1, shift: 1}
removed: ["row_id_5"]
table: "my_table_id"

["row_id_1", ... ]
```
- All changes are stored in ```data:```, in the new order.
- ```logic:``` is only available in ```singleDrag: true``` mode. Use ```from:``` and ```to:``` to move ```id:``` and ```shift:``` all rows in between.
- ```removed:``` a list of removed IDs. With ```singleDrag: true``` there will be at most one ID in this list.
- If ```returnArray: true```, you just get an ```Array``` in the new order instead of a ```json``` object.

#### returnArray
Change the ```return_obj``` in the ```change``` function to a simple ```Array```.
```
returnArray: true
```
- The default is ```false```, which will return a ```json``` object.

#### enable
The rows of the defined ```table:``` are dragable by default. Use ```enable``` to disable drag & drop if the columns are not sorted by ascending order in the given ```column:```.
```
enable: {
    attr: "class",
    enable: "sorted-asc",
    disable: "sorted-desc",
    head: "thead>tr>th",
    column: 1
},
```
- Set the row attribute ```attr:``` where the sort indication can be found.
- Disabled drag & drop if ```enable:``` is found in ```attr:``` of any column other than ```column:```
- Disabled drag & drop if the ```disable:``` is found in any ```attr:```.
- Use ```head:``` if the table header columns are not in the ```thead```. Default is ```"thead>tr>th"```.
- Use ```column:``` to set the correct order column. Default is ```0```, which always enables drag & drop.

#### rowDrag
By default rows can only be dragged by their drag icon. Set ```rowDrag``` to make the entire row dragable. Be sure there are no clickable items in the row.
```
rowDrag: true
```

#### singleDrag
By default drag & drops are stacked. The return_object returns the initial position ```from:``` and the new position ```to:``` for each row ID. Set ```singleDrag``` to reset the order after each drop. Use this setting if your ```change``` script updates your database immediately. ```logic:``` becomes available in the ```return_object```. You can use ```logic:``` ```from:``` and ```to:``` to move ```id:``` and ```shift:``` all rows in between.
```
singleDrag: true
```

#### animation (new since 1.1.0)
By default the dragable row will animate to its final place in 100ms. Use ```animation``` to set a new duration in milliseconds. ```animation: 0``` disables the animation.
```
animation: 200
```

#### remove (as of 1.2.0)
With ```remove``` rows can be removed by dropping them outside the boundaries of the table. An additinal Array ```removed``` with row IDs will be added to the ```return_object``` depending on the ```singeDrag``` and ```returnArray``` status. The ```logic``` property will pass ```to: 0``` for any removed row.
```
remove: true
```

## Methods
```ddListorder``` has a few methods available.

#### wait()
You can use this function in ```singleDrag``` mode. It prevents the user to drag & drop while you update your database for example. Don't forget to enable drag & drop on ```success``` with ```wait(false)```.
```
ddListorder.wait();

ddListorder.wait(false);
```

#### remove(object|ID) (as of 1.2.0)
You can remove rows by dragging them outside the boundaries of the table if ```remove: true``` is passed during initialisation. If not, rows can still be removed with this ```remove()``` method. You can pass an ID (string) or an object (the row or any object within the row).
```
ddListorder.remove("my_row_id");

ddListorder.remove(row_object);
```

## Styling
There's no styling for the drag & drop. However you can use some classes to make your own. Here is a simple example.
```
table.listorder .listorder-icon {
    position: relative;
    display: inline-block;
    width: 32px;
    height: 44px;
    margin: auto;
    background-color: #f0f0f0;
    opacity: 0.2;
    cursor: default;
}
table.listorder .listorder-icon:before {
    content: "";
    position: absolute;
    display: inline-block;
    width: 22px;
    height: 18px;
    margin-left: 5px;
    margin-top: 13px;
    background-image: repeating-linear-gradient(black, black 2px, transparent 2px, transparent 8px, black 8px, black 10px, transparent 10px, transparent 16px, black 16px, black 18px);
}
table.listorder.listorder-enabled .listorder-icon {
    opacity: 1;
    cursor: ns-resize;
}
table.listorder .listorder_clone {
    z-index: 1;
}
table.listorder .listorder_clone td {
    position: relative;
    background-color: #f0f0f0;
}
table.listorder.listorder-dragrow tr {
    cursor: ns-resize;
}
```
Or in ```Less``` format:
```
table.listorder
    .listorder-icon {
        position: relative;
        display: inline-block;
        width: 32px;
        height: 44px;
        margin: auto;
        background-color: #f0f0f0;
        opacity: 0.2;
        cursor: default;
        &:before {
            content: "";
            position: absolute;
            display: inline-block;
            width: 22px;
            height: 18px;
            margin-left: 5px;
            margin-top: 13px;
            background-image: repeating-linear-gradient(black, black 2px, transparent 2px, transparent 8px, black 8px, black 10px, transparent 10px, transparent 16px, black 16px, black 18px);
        }
    }
    &.listorder-enabled .listorder-icon {
        opacity: 1;
        cursor: ns-resize;
    }
    .listorder_clone {
        z-index: 1;
        td {
            background-color: #f0f0f0;
        }
    }
    .listorder-dragrow tr {
        cursor: ns-resize;
    }
}
```

## Example
A full example. See ```demo.html```.
```
ddListorder.init(
    {
        table: "my_table_id",
        data: {
            attr: "onclick",
            regex: "pnl42_dg65_([a-z0-9_]+)\""
        },
        change: my_function,
        enable: {
            attr: "class",
            enable: "sorted-asc",
            disable: "sorted-desc",
            head: "thead>tr>th",
            column: 1
        },
        rowDrag: true,
        singleDrag: false
    }
);
function my_function(obj) {
    console.log(obj);
    // do something with the new order from obj here!
}
```
