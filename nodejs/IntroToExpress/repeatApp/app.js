var express = require('express');
var app = express();

app.get('/', function(req, res){
	res.send('Welcome to Repeat App.');
});

app.get('/repeat/:message/:times', function(req, res){

	var message = req.params.message;
	var times = Number(req.params.times);

	var result = '';
	for (var i = 0; i < times; i++ ){
		result += message + ' ';
	}

	res.send(result);
});


app.get('*', function(req, res){
	res.send('Sorry, page not found...');
});

app.listen(3000, function(){
	console.log('Now serving your app.');
});