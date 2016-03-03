var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog_demo');

// POST - title, content
var postSchema = new mongoose.Schema({
	title: String,
	content: String
});
var Post = mongoose.model('Post', postSchema);

// USER - email, name
var userSchema = new mongoose.Schema({
	email: String,
	name: String,
	posts: [postSchema]
});
var User = mongoose.model('User', userSchema);

/*
var newUser = new User({
	email: 'test2@test.com',
	name: 'test2'
});

newUser.posts.push({
	title: 'test2 title 1',
	content: 'test2 content 1'
});

newUser.save(function(err, user){
	if (err) {
		console.log(err);
	} else {
		console.log(user);
	}
});
*/
/*
var newPost = new Post({
	title: 'title 1',
	content: 'content 1'
});

newPost.save(function(err, post){
	if (err) {
		console.log(err);
	} else {
		console.log(user);
	}
});
*/

User.findOne({name:'test2'}, function(err, user){
	if (err) {
		console.log(err);
	} else {
		// add a new post
		user.posts.push({
			title: 'test2 title 2',
			content: 'test2 content 2'
		});
		user.save(function(err, user){
			if (err) {
				console.log(err);
			} else {
				console.log(user);
			}
		});
	}
});

