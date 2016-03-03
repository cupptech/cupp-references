var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog_demo_2');

var Post = require('./models/post');
var User = require('./models/user');

/*
User.create({
	email: 'user1@test.com',
	name: 'user1'
});

*/
/*
Post.create({
	title: 'post 1',
	content: 'post 1 content'
}, function(err, post){
	console.log(post);
});*/

/*
Post.create({
	title: 'post 3',
	content: 'post 3 content'
}, function(err, post){
	User.findOne({email:'user1@test.com'}, function(err, foundUser){
		if (err) {
			console.log(err);
		} else {
			foundUser.posts.push(post);
			foundUser.save(function(err, data){
				if (err) {
					console.log(err);
				} else {
					console.log(data);
				}
			});
		}
	});
});
*/

// find user and all posts 
User.findOne({email:'user1@test.com'})
	.populate('posts')
	.exec(function(err, user){
		if (err) {
			console.log(err);
		} else {
			console.log(user);
		} 
	});

