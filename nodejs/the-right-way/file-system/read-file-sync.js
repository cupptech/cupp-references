var fs = require('fs');
var data = fs.readFileSync('test.txt');
process.stdout.write(data.toString());
