var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var User = require('./models/user');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/auth-demo-app');

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(require('express-session')({
	secret: 'This is the best secret',  // encode/decode session
	resave: false,
	saveUninitialized: false
}));

// use passport
passport.use(new LocalStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());

// encode
passport.serializeUser(User.serializeUser());
// decode
passport.deserializeUser(User.deserializeUser());

// ROUTES 

app.get('/', function(req, res){
	res.render('home');
});

app.get('/secret', isLoggedIn, function(req, res){
	res.render('secret');
});

// AUTH ROUTES
// show sign up form
app.get('/register', function(req, res){
	res.render('register');
});

// handling user sign up
app.post('/register', function(req, res){
	User.register(new User({username: req.body.username}),
		req.body.password,
		function(err, user){
			if (err) {
				console.log(err);
				return res.render('register');
			} 
			passport.authenticate('local')(req,res,function(){
				res.redirect('/secret');
			});
		});
});

// LOGIN ROUTES
// render login form
app.get('/login', function(req, res){
	res.render('login');
});

// login logic
// middleware
app.post('/login', passport.authenticate('local', {
	successRedirect: '/secret',
	failureRedirect: '/login'
}), function(req, res){

});

app.get('/logout', function(req, res){
	// destroy user data in the session
	req.logout();
	res.redirect('/');
});

// middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

app.listen(3000, function(){
	console.log('Server started...')
});
