const readline = require('readline');
const fs = require('fs');
//read stream
myInterface=readline.createInterface({
  input:fs.createReadStream('text.txt')
});

const printData=(data)=>{
  console.log(`Item: ${data}`);
}
myInterface.on("line", printData)


//write stream
const fileStream=fs.createWriteStream('textResults.txt');
const transformData= (line)=>{
  fileStream.write(`They were out of: ${line}\n`);
}
myInterface.on('line',transformData);