"use strict";

var zmq = require('zmq'),
  
// create subscriber endpoint
var subscriber = zmq.socket('sub');

// subscribe to all messages
subscriber.subscribe("");

// handle messages from publisher
subscriber.on("message", function(data) {
  var message = JSON.parse(data);
  var date = new Date(message.timestamp);
  console.log("File '" + message.file + "' changed at " + date);
});

// connect to publisher
subscriber.connect("tcp://localhost:5432");
