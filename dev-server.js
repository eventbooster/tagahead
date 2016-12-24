/**
* Super simple webserver to test everything (as serving files from the file system
* has some limitations)
*/

var express = require('express');
var app = express();

app.use(express.static('.'));

app.listen(3000, function () {
  console.log('Dev server listening on port 3000!');
});