'use strict';
  
var fs = require('fs');
var net = require('net');
  
var filename = process.argv[2];
  
var server = net.createServer(function(connection) {
    
    // reporting
    console.log('Subscriber connected.');
    connection.write(JSON.stringify({
      type: 'watching',
      file: filename
    }) + '\n');
    
    // watcher setup 
    var watcher = fs.watch(filename, function() {
      connection.write(JSON.stringify({
        type: 'changed',
        file: filename,
        timestamp: Date.now()
      }) + '\n');
    });
    
    // cleanup
    connection.on('close', function() {
      console.log('Subscriber disconnected.');
      watcher.close();
    });
  });

if (!filename) {
  throw Error('No target filename was specified.');
}

server.listen(5432, function() {
  console.log('Listening for subscribers...');
});

