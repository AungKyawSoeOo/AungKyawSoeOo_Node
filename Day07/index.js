var express = require('Express');
var app = express();

var things = require('./things.js');

//both index.js and things.js should be in same directory
app.use('/', things);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});