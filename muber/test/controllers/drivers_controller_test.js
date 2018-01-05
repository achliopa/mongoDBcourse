const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Driver = mongoose.model('driver');

describe('Drivers controller', () => {
	it('Post to /api/drivers creates a new driver', (done) => {
		Driver.count().then((count) => {
			request(app)
				.post('/api/drivers')
				.send({ email: 'bada@bada.de'})
				.end((err,response) => {
					Driver.count().then((newCount) => {
						assert(count + 1 === newCount);
						done();
					});
				});
		});
		
	});

	it('PUT to /api/drivers/:id edits an existing driver', (done) => {
		//create the driver/edit the driver/ pul the driver back
		const driver = new Driver({ email: 't@t.com', driving: false });

		driver.save().then(() => {
			request(app)
				.put(`/api/drivers/${driver._id}`)
				.send({driving: true})
				.end(() => {
				Driver.findOne({email: 't@t.com'})
					.then((driver) => {
						assert(driver.driving === true);
						done();
					});
			});
		});

	});

	it('DELETE to /api/drivers/:id can delete a driver', (done) => {
		//create the driver/delete the driver/ check he not found
		const driver = new Driver({ email: 't2@t2.com', driving: false });

		driver.save().then(() => {
			request(app)
				.delete(`/api/drivers/${driver._id}`)
				.end(() => {
					Driver.findOne({email: 't2@t2.com'})
						.then((driver) => {
							assert(driver === null);
							done();
						});
				});
		});
	});

	it('GET to /api/drivers finds drivers in a location', (done) => {
		const seattleDriver = new Driver({
			email: 'seattle@test.com',
			geometry: {
				type: 'Point',
				coordinates: [-122.4759902, 47.6147628]
			}
		});

		const miamiDriver = new Driver({
			email: 'miami@test.com',
			geometry: {
				type: 'Point',
				coordinates: [-80.253, 25.791]
			}			
		});

		Promise.all([seattleDriver.save(),miamiDriver.save()])
		.then(() => {
			request(app)
				.get('/api/drivers?lng=-80&lat=25')
				.end((err,response) => {
					//assert(response.body.length === 1);
					//assert(response.body[0].objemail === 'miami@test.com');
					done();
				});
		});
	});
});