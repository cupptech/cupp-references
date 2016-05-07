var fs = require('fs');
fs.writeFile('test.txt', 'a witty message', function (err) {
  if (err) {
    throw err;
  }
  console.log("File saved!");
});