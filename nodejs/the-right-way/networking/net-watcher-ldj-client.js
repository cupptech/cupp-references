"use strict";

var net = require('net');
var ldj = require('./ldj.js');
  
var netClient = net.connect({ port: 5432 });
var ldjClient = ldj.connect(netClient);

ldjClient.on('message', function(message) {
  if (message.type === 'watching') {
    console.log("Now watching: " + message.file);
  } else if (message.type === 'changed') {
    console.log(
      "File '" + message.file + "' changed at " + new Date(message.timestamp)
    );
  } else {
    throw Error("Unrecognized message type: " + message.type);
  }
});