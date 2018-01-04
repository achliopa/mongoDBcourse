const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


before((done) => {
	mongoose.connect('mongodb://localhost/users_test');
	mongoose.connection
		.once('open', () => { done();})
		.on('error', (error) => {
			console.warn('Warning', error);
	});
});

beforeEach((done) => {
	// mongoose.connection.collections.users.drop(() => {
	// 	// ready to run the next test
	// 	done();
	// });

	// w/association and multiple collections
	const { users, comments, blogposts } = mongoose.connection.collections;
	users.drop(() => {
		comments.drop(() => {
			blogposts.drop(() => {
				done();
			});
		});
	});
});