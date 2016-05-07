"use strict";

var fs = require('fs');
var spawn = require('child_process').spawn;
var filename = process.argv[2];

if (!filename) {
  throw Error("A file to watch must be specified!");
}

fs.watch(filename, function() {
	// invoke the ls command with the -lh options.
  	var ls = spawn('ls', ['-lh', filename]);
  	// send the standard output from the child process directly to standard output stream.
  	ls.stdout.pipe(process.stdout);
});
console.log("Now watching " + filename + " for changes...");