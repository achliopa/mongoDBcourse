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

* When we nest / embedd the subdocuments it is inefficient to query it in isolation. as we need to go through all partent documents to assemble the list. in a nutshell when the subdocument gets big or could be used separately should be a collection of its own (separate model)
* its hard to implement complex relations like users-posts-comments with nested subrecords
* we will implement another way of connecting subdocuments by creating 2 new models blogPost and comment with their Schemas and connecting the to user

## Lecture 57 - Associations w/ Refs

* we create the associations by using a specific objecttype for schema properties. e.g.

const CommentSchema = new Schema({
	content: String,
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	}
});
* we provide as type Schema.types.ObjectId and as ref the model definition we uses in the declaration
* this is like the foreign key in relational databases.
* we refactor the testhelper so as to drop multiple collections prior toi test. we need to do it sequentialy so we do callback nesting as they are asynchronous
* be aware that mongoose normalizes collection names to all small letters no matter if we do it camelcase. so when we use mongoose.connection.collections we expect the name to be smallletter
* setting associations is as easy as setting object properties. 
e.g. 		blogPost.comments.push(comment);
		comment.user = joe;
* behind the scenes mongoose has custom setter which sets the association based on objectId
* when we wanto run multiple async functions in parallel but want to set an exit point common for all (e.g. done()) we use ES6 Promise.all() where we pass an array containing the async functions. in th then statement we put our exit point
* if we want to run a test in isolation in mocha we use it.only()
* querying a record with an association does not bring the suddocument, only its id
* the execution flow chain of a query in Mongo is the following 1) Model Class 2) Query Function with query object 3) Query Modifier 4) Executor (then() for ES6, promises, exec() for ES5 with callbacks)
* the modifier can populate the subdocument in the parent record in a query e.g. User.findOne({name: 'Joe'})
			.populate('blogPosts')
			.then((user)
* we cannot chain modifiers to get deep nested subdocuments. we can use single populate method but by chaining populate objects in it to query nested subdocuments
e.g populate({
				path: 'blogPosts',
				populate: {
					path: 'comments',
					model: 'comment',
					populate: {
						path: 'user',
						model: 'user'
					}
				}
			}) 

# Section 10 - Mongoose Middleware

## Lecture 63 - CleanUp with Mongoose Middleware

* we can asign a number of middlewares before the event (save, validate etd) and after the event ()
* middlewares are assigned to the Schema as pre() or post() passing the event and the next callback like express middlewares. we use oldschool callback functions to access this. mongoose gives us a way to move all searching and delete to the db with $in. also this removes the need to import model class in the user model avoiding  code entagnling , loop imports which cause problem in startup of app. e.g.
UserSchema.pre('remove', function(next) {
	const BlogPost = mongoose.model('blogPost');
	// this===model instance
	BlogPost.remove({ _id: { $in: this.blogPosts }})
		.then(()=> next());
});

# Section 11 - Big Collections/Paginations

## Lecture 67 - Skip & Limit

* skip and limit are query modifiers that implement pagination in the db using mongoose. syntax skip(number of records to skip) limit(page size)
* query modifiers are moddlewares and chain
* we can use sort as query modifier to sort our results. we pass in an object much like query object with the param to sort by and the order 1 is ascending
e.g
User.find({})
			.sort({ name: 1 })
			.skip(1)
			.limit(2)
			.then((users) =>

# Section 12 - Project

## Lecture 70 - Project Setup

* clone project from git@github.com:StephenGrider/UpStarMusic.git (git clone ...)
* cd to UpStarMusic folder and run npm install
* start project with npm run start
* app is native using a pacakge called electron! (https://electronjs.org/)

## Lecture 73 - Album Schema

* we implement Artist Schema + Model, Album Schema and embedd Album Schema in Artist as as Subdocumet
* first query: find random artist solution Artist.findById(_id);

# Section 13 - Hard-Mode Project

## Lecture 83 - Min/Max Queries

* a simple solution is to get all items back with the query and then search through the array for min max. e.g
	return Artist.find({}).sort({age: 1}).then((artists) => {
			return ({min: artists[0].age, max: artists[artists.length-1].age});
	});
* this is not efficient because big data are moving through servers also searching is more efficient in db
* we resolving it by doing 2 queries and limiting the results to 1.
* then we cobine Promises with promise all. note that Promise.all resolves in then with an array containing the results of both async functions.
* a good trick is to modify the resolving object in then by using the arrow function and returning what we want e.b .then(artist => artist.age)
* also note that even when we limit results to 1 query still returns an array of model instances with length of 1
e.g. 	const minQuery = Artist
		.find({})
		.sort({ age: 1})
		.limit(1)
		.then(artists => artists[0].age); 

## Lecture 85 - Search Queries
* passing variable ad object propery name
** ES5 	const property = 'name';
		const obj = {}; 
		obj[property] = 1;
** ES6  const obj = {[property]: 1 }
* insert min and max to property values in the query object using mongoDB and mongoose operators $lt gt, lte, gte :
		query.yearsActive = {
			$gte: criteria.yearsActive.min,
			$lte: criteria.yearsActive.max
		}
* switch dbs in mongo cli : use db_name
* mongo supports super fast index search.
* by default each collection document has an _id which is its index
* ids are stored in a separate list to support fast queries e.g findById()
* mongo supports indexing to only  one additional document param.
* this is done in mongo cli with the command
db.collection.createIndex({ property: "indextype"})
* a supported indextype is text.
* text index allows to add the $index query operrator in our query object performing text bases searches in the db which are FAST.
* mongo replys with {
	"createdCollectionAutomatically" : false,
	"numIndexesBefore" : 1,
	"numIndexesAfter" : 2,
	"ok" : 1
}

* then we can issue a query like query.$text = { $search: criteria.name }; to perform text based search on the text indexed property (e.g. name)
* to update multiple records at once we can use $in to go throu multiple ids or parameter values. also we add a 3rd argument to the Model.update() function an ibject with mullti: true to triger multiple updates at once e.g

	return Artist.update(
		{ _id: { $in: _ids } }, 
		{retired: true}, 
		{multi: true});	
* faker library is great for seeding with fake names

# Section 14 - Mongo with Node and Express

## Lecture 98 - Project Setup

* RESTful Routes
** Create a Driver - POST /api/drivers
** Delete a Driver - DELETE /api/drivers/id
** Edit a Driver - PUT /api/frivers/id
** Find Drivers - GET /api/drivers
* Purely Backend API Node/Express
* mkdir & cd muber
* npm init
* npm install --save mongoose mocha express

## Lecture 101 - Express BoilerPlate

* usual stuff import and init express in app.js
* for what ever reson he puts express server listen command in another file (index.js)
* we want to test our express up, so to test our http requests we install supertest: npm install --save supertest
* we create a test folder and an app_test js file
* we import supertest as request (naming convention), asser and the app
* mocha tests to http are async so we use done
* supertest is use by using the syntax e.g
		request(app)
			.get('/api')
			.end((end,response) => {
				assert(response.body.hi === 'there');
				done();
			});
* this is a simple test to get /api in app server. the end() err is not related to the express server but to the supertest internal. we care about response to extract data for assert like status and body

## Lecture 105 - Project Structure

* he breaks the express logic in a router file containing only the routes separating the reply functions and putting the in controller whigh instracts with the model (mongoose model classes)
* the import flow is index -> app -> routes -> drivers_controller
* drivers_controller exports functions implenting the reply logic
* routes exports afunction that take app and implements/invokes the routes 
* we implement post /api/drivers route
* express is not good at parsig request body as it comes in chunks. we use body parser library to solve it : npm install --save body-parser
* body parser is a middleware . we use it globally with app.use(). we MUST put it before route invokation in app.js
* in supertest we can send test data in a post route test with send() e.g
request(app)
			.post('/api/drivers')
			.send({ email: 'bada@bada.de'})
* we import our Driver Model into test file.js not with the default export but with const Driver = mongoose.model('driver'); This is done as mocha and mongoose complain when we import the already define model for duplicates. its a workaround
* we use Model.create(req.body) to persist data to db.

## Lecture 114 - Testing with Postman

* we issue a post request to localhost:3050/api/drivers with boy raw-.json passing a json object 
* when we enter nothing we wait forever
* we need to catch the error from mngoose returnign status 400somthing

## Lecture 116 - Separate Test Database

* we need to set a test DB to drop everything before test
* we introduce the process environemnt NODE_ENV (process.env.NOD_ENV)
* we correctly set this variable anytime the server starts. a way is to do it in package.json test script : "test": "NODE_ENV=test nodemon --exec 'mocha --recursive -R min'"
* in app.js we wrap nongoose connection to the dev db in an if statetemtn
that checks that process.env.NODE_ENV !== 'test'
* we add a test_helper.js file in test folder
* in there we add a before() hook to the mocha and connect to the test db
* only mocha runs the test files (test folder?!?!) so we dont need to check node environment
* we also add a handler to run the tests only after we have connected to the db. using promises : mongoose.connection.once('open').on('error')
		.once('open', ()=> done())
		.on('error', err => {
			console.warn('Warning',err);
		});
* we drop the drivers collection before each test with the beforeEach hook in test_helper.
beforeEach(done => {
	const { drivers} => mongoose.connection.collections;
	drivers.drop()
		.then(() => done())
		.catch(() => done());
});

## Lecture 117 - Express Middleware

* flow: req->middleware->middleware->route_handler->res
											|_> (ERROR) -> middleware->res
* we write a global middleware with app.use((err,req,res,next) => {}); in app.js
* to implement the flow above we place its implementation AFTER the route invokation. and we use the err argument IF the routes throws an error to catch it (SMART!!!).it probably catches express errors
* we move between middlewares with next. to implement the error catching flow we put a .catch() to catch the promise reject from mongoose in drivers post route passing next to move to the custom error handling middleware 			.then(driver => res.send(driver))
			.catch(next);
* we also need to pass next as 3rd argument after req res in the drivers route implementation (controller) 
* in put route /api/drivers/:id :id is a wildcard. we can put whateverthere. we extract the data in the route hadler by accessing req.params.id as id is the properyname of the wildcard
* Model.findByIdAndUpdate does not return the updated record in resolve promise. just some statistics. so we need to call again findById to get the object back

## Lecture 122 - Geography in MOngoDB

* mongo uses lat and log for geolocation [Longitude, Latitude]
* can natively calculate distanse in 2d and 2d Sphere

## Lecture 123 - GeoJSON Schema

* www.geojson.org shows the way geojson is structured
* we add  a new Schema in our drivers.js called PointSchema. it has 2 attributes type and coordinates. type is a string with default value Point and coordinates an array of numbers with an index of 2dsphere for ultra fast search based on 2d  sphere distance
const PointSchema = new Schema({
	type: { type: String, default: 'Point' },
	coordinates: { type: [Number], index: '2dsphere' }
});
* we embed this schema in our drivers schema as geometry
* to extract request parameters from a get request we extract them from req.query
* Model.GeoNear() is deprecated. use the follwing code instead
Driver.find({
        	'geometry.coordinates': {
            	$nearSphere: {
                	$geometry: {
                    	type: "Point",
                    	coordinates: [lng, lat]
                	},
                $maxDistance: 200000
            }
        }
    })
* we write a test queriying route get('/api/drivers?lng=-80&lat=25')
* no success. we check that index is missing in DB collectionm
* this is because after each test we drop the db. but schema is created only at the beginning so it is not recreated
* we need to add the follwing to drivers.drop() in beforeEach hook 		.then(() => drivers.ensureIndex({'geometry.coordinates': '2dsphere' }))