const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const BlogPost = require('../src/blogPost');

describe('Middleware', () => {

	beforeEach((done) => {
		joe = new User({ name: 'Joe'});
		blogPost = new BlogPost({
			title: 'JS is Great',
			content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil quas dolores maxime ipsam ipsum ipsa sequi, aliquid enim porro, necessitatibus alias perferendis ut excepturi. Eligendi nulla inventore aperiam rem nemo.'
		});
	
		joe.blogPosts.push(blogPost);

		Promise.all([joe.save(), blogPost.save()])
			.then(() => done());
	});

	it('users clean up dangling blogposts on remove', (done) => {
		joe.remove()
			.then(() => BlogPost.count())
			.then((count) => {
				assert(count === 0);
				done();
			});
	});
});
