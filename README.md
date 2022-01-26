# Listorder
Small and simple javascript library for manipulating row in a predefined table.

## The story
Initiate ```ddListorder``` with any given table and all selected rows can be reordered by drag & drop. Pass a return function and handle the drop change at your will, updating internal arrays, input fileds or a database.

## On the  whislist
- The current version does not yet work on touch devices.
- Updating a database usig ajax and the 'logic' return object does not yet update the internal structure. You now need a pageload first. The idea is that a function should trigger the internal structure update after a succeeded ajax call.

## Dependencies
```jQuery```

## Installation
Download the latest version ```ddListorder.js``` or ```ddBasecolor.min.js``` and include the file in your project.
```
<script type='text/javascript' src='ddListorder.1.0.0.min.js'></script>
```
Or link ```ddListorder``` from design-dude.nl. This will always be the latest version.
```
<script type='text/javascript' src='https://www.design-dude.nl/classes/ddListorder.min.js'></script>
```

## Constructor
```var my_color = new ddListorder.init(options=json);```
Call ```ddListorder``` and provide the necessary options for the table.
```
