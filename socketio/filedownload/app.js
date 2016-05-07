var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next){
	res.sendFile(__dirname + '/index.html');
});

io.of('/download').on('connection', function(socket){
	// console.log('Client connected...');

	socket.on('join', function(data){
		console.log(data);
		socket.emit('messages', 'Hello from server');
	});

	socket.on('downloadRequest', function(data){
		console.log(data);
		var filename = 'test.png';
		// var filename = 'test.zip';
		// var filename = 'large.jpg';

		fs.readFile(filename, function(err, buf){
			console.log('emit download response');
			socket.emit('downloadResponse', {filename: filename, buffer: buf});
		});
	});
});

server.listen(5000, function(){
	console.log('Express server listening on 5000.');
});