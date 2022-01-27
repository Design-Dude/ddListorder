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
```ddListorder.init(options=json);```
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
- The tabledefinition is optional.
- Without '''table:''' option there must be a ```data.rows``` array with unique row id's.
- If there is a table found without id attribute, using row id's from ```data.rows```, the table will get an automated id like ```id="listorder_"+instance counter```
- The key ```id:``` may be any table attribute from the DOM where the table_id is located. For instance ```table: data-id:"my_table_id"``` will look for ```data-id="my_table_id"```

#### data
#### change
#### returnType
#### enable
#### rowDrag
#### singleDrag

## Styling

## Example
