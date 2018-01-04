# Section 2

## Lecture 3 - Install MongoDB

* install homebrew (for Mac)
* install node
* install mongo (in my machine it is a global install)
* start mongo server with mongod (in my machine sudo mongod)
* needs data/db to run normally with root rights
* to run as user take ownership of the folder: sudo chown -Rv username /data/db
* to run it at boot 
sudo crontab -e
* add this to cron file: @reboot sudo service mongod start &
* install robomongo (robo 3t)
* create a Local connection to localhost:27017

# Section 5 - Funcdamentals

## Lecture 12 - Fundamentals of MongoDB

* We use Mongoose as an ODM or ORM ( Object-Resource/Data Mapping)
* we can create multiple databases in a single mongo instance
* each database can have multiple databases . each database can have multiple collections. each collection (single type of resource) can have multiple documents
* core mongo operations (create,update,read,destroy) CRUD

# Section 6 - TDD Experience

## Lecture 14 - Project Overview

* we work in users folder
* we initiate npm with npm init
* we install mocha mngoose nodemon  with npm install --save mocha nodemon mongoose
* we add a test_helper.js file to initiate connection
* there we import mongoose and connect to the db
mongoose.connect('mongodb://localhost/users_test');
* we listen for specific events on connection with once and on

## Lecture 17 - Mongoose Models

* a model rep[resents a]l items in a collection like a class
* an instance of a model represents a single item
* a scehma is a component of the model, what properties are expected
const UserSchema = new Schema({
	name: String
});
* model is created based on a schema. its creation makes the collection in db
const User = mongoose.model('user', UserSchema);

## Lecture 19 - Mocha

* mocha  test blocks are set with describe function
* individual tests with it function
* in it function we need an assertion. we use assert  that comes with mocha
* we add a test script in package.json     "test": "mocha"
* we run with npm run test

## Lecture 21 - Create Model Instances

* we instantiate the model with new passing the object literal with the parameters
* we call save() to persist in db (create)
* any test run creates new document in collection
* to prevent duplicates we drop the db at initialization script
* we use beforeEach() hook which is called before every test
* we use mongoose.connection.collections.users to access users colllection in db
* we use drop() to drop the collection
* this is async function . mongoose has provision for this. a callback acalled done()
* we pass it as an argument to the anonymous callbackfunction we pass to the hook.
* at drop we pass a callback function which merely calls done upon completion.
* surely we could use promises or even async/await o this
* save() is async. so we use promises  and then() to assert the result after it finishes
* we use objectInstance.isNew property to test. isNew becomes false when value is saved in mongo.
* we pass done in it function and call done in the then callback after assertion to continue testing
* to get rid of mongoose waarning o promise we pass our own promise library. in setup we write: mongoose.Promise = global.Promise;
* we improve performane by connectin to the db before starting the testing with before() hook. we pass as argumentdone to trigger continuation as it is async. in opening the connection we call done()

## Lecture 27 - Find Records from DB

* we make a new describe block
* in it (namespace we define a beforeEach function to populate our db for testing. it uses done as itis async.)
* we use the find and findOne methods which are class methods as they refer to the Model
* find returns an array, findOne returns single record
* mongoose assign an id to the model instance the moment we create it. not when it is persisted to the db. this is a difference with other dbs
* ids are not identical as they are objects (ObjectID) cannot === them. we can use expect isEqual. Or chaint the toString() method tp object._id

## Lecture 30 - Automate with Nodemon

* to automate test we can use mocha --watch. but it has some issues with mongoose
* we use nodemon. our test script in package.json becomes "test": "nodemon --exec 'mocha -R min'" -R clear out all text, min = minified text , no description

## Lecture 32 - Remove Records

* many methods to choose from
** Model Class methods (e.g. User.): remove, findOneAndRemove, findByIdAndRemove. with criteria
** model instance methods (e.g user. or joe.): remove(). no criteria
* in describe block we do our test prep like in reading_test file populating our db
* to test deletion we chain promises by calling find after deletion in the then() method. the second promise (findOne) return is handled by a chained then() where we put our assertion and done() to end the test
* Class Model fucntions get an object as criteria except from findByIdAndRemove which gets an id directly

## Lecture 35 - Update Records

* many methods to choose from
** Model Class methods (e.g User.): update, findOneAndUpdate, findByIdAndUpdate
** model instance methods(e.g. user.): update, set, save
* set and save is done by calling first set with a key value pair(e.g. 		joe.set('name', 'Alex')) to set a property in memory and then calling save() on the object to persist in db
* update gets an object literal with the param to change as an argument.
* we move promise chaining and assertion in as separate function where we pass the operation func and the callback(done)
* class methods are like remove class methods but they get as second argument an object literal with the param update

# Section 7 - Mongo Operators

## Update Operators

* to add a new property to a model we need to update the model schema
* updating the schema adding params doesnt break tests
* if we want to increment a counter based on criteria we cab fetch the data  inc the counter and store them back. we want to avoid moving data between the db and our app. we use mongoDB operators like $inc, syntax:
User.update({name: 'Joe'}, { $inc: { postCount: 1 }})
* mongoose offers validation
* validation can be doe in schema model by seting an object as value for a parameter {
		type: String,
		required: [true, 'Name is required.']
	},
* validation of an object can be done synchronously with validateSync() or asynchronously with validate() . the first return validationresult object when second gets a callback which itself get the cvalidation result as argument
* validation can be done with a function where in the scema model attribute value object we set a parameter validate which gets an object with a method validator with custom logic. returning false fails and true passes validation
validate: {
			validator: (name) => name.length > 2,
			message: 'Name must be longer than 2 characters.'
		},

# Section 8 - Relational Data

## Lecture 45 - Embedding Resources to Models

* we can have multiple schemas but one Model (and one collection) where they are embedded as subdocuments.
* embedding is done by adding the subdocument schema as a paramter objectype to the master document schema e.g 	post: [PostSchema]
* because we dont have subdocument model to add more subdocuments of same type in an array of a record we need to set and save the master record. we can save only models
* to chain promises we need to return a promise inside of then
* when I remove a subdocument with remove() it is not removed from database . in contrast with model instances. this is because the subdocumet has no Model Class of itself but is embedded to the Model Class Schema.

## Lecture 50 - Virtual Types/Fields/Properties

* By embedding and having a separate subdocument counter as a property to the master record we have to keep track of it ourselves
* virtual types are not saved in the db they are calculate on the fly anytime we retrieve a record. 
* we remove it from the schema but some tests fail as a consequence
* $inc doesnt work as it operates on a missing property
* we dissable mocha  tests by changing it to xit
* virtual property is defined outside of the schema with the virtual() function odf the scehma
* virtual property definition makes use of ES6 get/set functionality
** in standard JS when we write joe.postCOunt we go in the joe object and return the postCount value. this is a get function. in ES6 we can
overwrite the standard functionality by making use of a get() function
where we define our own custom logic. what we return in this custom function is what we get when we call the virtual type
** this function will be a standard function not an arrow. because we want access to this . as this is the model instance containing the property(array) we want to count (posts)
** syntax
UserSchema.virtual('postCount')
	.get(function() {
		return this.posts.length;
	});

# Section 9 - Schema Design

## Lecture 54 - Drawbacks of Nested Resources

*
