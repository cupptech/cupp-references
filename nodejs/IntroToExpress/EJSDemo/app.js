var express = require('express');
var app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
	// render file in views directory
	res.render('home');
	// res.send('<h1>Welcome to the home page</h1>');
});

app.get('/hello/:name', function(req, res){
	var name = req.params.name;
	// pass data object to template
	res.render('hello', {
		name: name
	});
});

app.get('/posts', function(req, res){
	var posts = [
		{title: 'Post 1', author: 'John'},
		{title: 'Post 2', author: 'John'},
		{title: 'Post 3', author: 'John'}
	];

	res.render('posts', {posts: posts});
});

app.listen(3000, function(){
	console.log('Server is listening!!!');
});
