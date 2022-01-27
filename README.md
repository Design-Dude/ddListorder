# Listorder
Small and simple javascript library for manipulating row in a predefined table.

## The story
Initiate ```ddListorder``` with any given table and all selected rows can be reordered by drag & drop. Pass a return function and handle the drop change at your will, updating internal arrays, input fileds or a database.

## On the  whislist
- The current version does not yet work on touch devices.

## Dependencies
```jQuery```

## Installation
Download the latest version ```ddListorder.js``` or ```ddListorder.min.js``` and include the file in your project.
```
<script type='text/javascript' src='ddListorder.1.0.0.min.js'></script>
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
ddListorder.init();
ddListorder.version; // version
ddListorder.info; // meta information
```

## Options properties
#### table
Table definition.
```
table: "my_table_id"
table: { id: "my_table_id" }
```
- The table definition is optional.
- Without the ```table:``` option there must be a ```data.rows``` array (see below) with unique row IDs to find the table.
- If ```ddListorder``` finds a table using the row IDs of ```data.rows```, the table gets an automated ```id``` like ```id="listorder_" + instance counter ``` if it does not have its own id.
- The key ```id:``` may be any table attribute from the DOM where the actual ID is located. For instance ```table: { data-id:"my_table_id" }``` will look for attribute ```data-id="my_table_id"```

#### data
#### change
#### returnType
#### enable
#### rowDrag
#### singleDrag

## Styling

## Example
