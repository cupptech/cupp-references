"use strict";

var events = require('events');
var util = require('util');

// client constructor
var LDJClient = function(stream) {
    events.EventEmitter.call(this);
    
    var self = this;
    var buffer = '';

    stream.on('data', function(data) {
      buffer += data;
      var boundary = buffer.indexOf('\n');
      while (boundary !== -1) {
        var input = buffer.substr(0, boundary);
        buffer = buffer.substr(boundary + 1);
        self.emit('message', JSON.parse(input));
        boundary = buffer.indexOf('\n');
      }
    });
  };
util.inherits(LDJClient, events.EventEmitter);

// expose module methods
exports.LDJClient = LDJClient;
exports.connect = function(stream){
  return new LDJClient(stream);
};