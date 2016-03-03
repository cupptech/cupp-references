// ODM: Object Data Model
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/user_app');

// define a pattern for data
var userSchema = new mongoose.Schema({
	name: String,
	age: Number,
	email: String
});

// compile to model
// make a collection: users
var User = mongoose.model('User', userSchema);

/*
// adding a new user to the DB 
var newUser = new User({
	name:'Sam',
	age:'22',
	email: 'test2@test.com'
});

newUser.save(function(err, user){
	if (err) {
		console.log('Something went wrong.');
	} else {
		console.log('Saved an user to the db.');
		console.log(user);
		console.log(newUser);
	}
});
*/

User.create({
	name:'Jerry',
	age:'22',
	email: 'test2@test.com'
}, function(err, user){
	if (err) {
		console.log('Something went wrong.');
	} else {
		console.log('Created an user to the db.');
		console.log(user);
	}
});

// retrieve all cats from the DB and console.log each one
User.find({}, function(err,users){
	if (err) {
		console.log(err);
	} else {
		console.log('ALL THE USERS...');
		console.log(users);
	}
});

