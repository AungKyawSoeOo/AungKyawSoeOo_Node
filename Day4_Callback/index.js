const fs = require("fs");

//Asynchronous
let readDataCallback = (err, data) => {
  if (err) {
    console.log(`Something went wrong ${err}`);
  } else {
    console.log(`Provided file contained data(Asynchronous): ${data.toString()}`);
  }
}
fs.readFile('test.txt', readDataCallback);
console.log("Hey I am first");

//Synchronous
let syncRead = fs.readFileSync('test.txt');
console.log("Synchronous data : " + syncRead.toString());



