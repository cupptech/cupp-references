"use strict";

var zmq = require('zmq');
var filename = process.argv[2];

// create request endpoint
requester = zmq.socket('req');

// handle replies from responder
requester.on("message", function(data) {
  var response = JSON.parse(data);
  console.log("Received response:", response);
});

requester.connect("tcp://localhost:5433");
// send request for content
console.log('Sending request for ' + filename);
requester.send(JSON.stringify({
  path: filename
}));
