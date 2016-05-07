var fs = require('fs');
fs.watch('test.txt', function() {
  console.log("File 'test.txt' just changed!");
});
console.log("Now watching test.txt for changes...");