var express = require('express');
var app = express();

// '/' => 'Hi there!'
app.get('/', function(req, res){
	// req contains all info about the request
	res.send('Hi there!');
});

// 'bye' => 'Goodbye!'
app.get('/bye', function(req, res){
	// req contains all info about the request
	res.send('Goodbye!');
});

// Example: reddit.com
// Route Params: using patterns
app.get('/r/:subredditName', function(req, res){
	res.send('Welcome to subreddit:' + req.params.subredditName);
});

app.get('/r/:subredditName/comments/:id/:title', function(req, res){
	res.send('Welcome to the comments page.');
});

// Catch all requests
// Order of routes matters
app.get('*', function(req, res){
	res.send('You are a star!');
});

// Tell Express to listen for requests
app.listen(3000, function(){
	console.log('Server has started!');
});

// Test using Postman, check response body.


