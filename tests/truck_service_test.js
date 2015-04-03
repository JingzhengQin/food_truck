
var express = require('express');
var should = require('should');
var test_server = require('../app.js');
var request = require('supertest')(test_server.app);

var Test_Truck_Id = '305709';
var Invalid_Truck_Id = "no_existing_truck";

var Test_Latitude = 37.763;
var Test_Longitude = -122.43;
var Test_Distance = 10000;

describe("Setup test server", function() {
	it('Steup test with no error', function(done) {
		test_server.refresh_trucks(function(err) {
			if (err) done(err);
			done();
		});
	});
})

describe("Test GET /trucks", function() {
	it('should return no empty json response', function(done) {
		request
		.get('/trucks')
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function(err, res) {
			should.not.exist(err);
			should.exist(res);
			res.body.length.should.above(0);
			done();
		});
	})
})

describe("Test GET /truck/" + Test_Truck_Id, function() {
	it('should return truck with id ' + Test_Truck_Id, function(done) {
		request
		.get("/truck/" + Test_Truck_Id)
		.expect(200)
		.end(function(err, fetched_truck) {
			should.not.exist(err);
            fetched_truck.body.should.have.property("location_id");
            Test_Truck_Id.should.equal(fetched_truck.body.location_id);
			done();
		})
	})
    
    it('should return empty content for ' + Invalid_Truck_Id, function(done) {
		request
		.get("/truck/" + Invalid_Truck_Id)
		.expect(200)
		.end(function(err, fetched_truck) {
			should.not.exist(err);
            should.exist(fetched_truck.body);
            fetched_truck.body.should.not.have.property("location_id");
			done();
		})
	})
})

describe("Test GET /cache/truck/" + Test_Truck_Id, function() {
	it('should return truck with id: ' + Test_Truck_Id, function(done) {
		request
		.get("/cache/truck/" + Test_Truck_Id)
		.expect(200)
		.end(function(err, fetched_truck) {
			should.not.exist(err);
            fetched_truck.body.should.have.property("location_id");
            Test_Truck_Id.should.equal(fetched_truck.body.location_id);
			done();
		})
	})
    
    it('should return empty content for ' + Invalid_Truck_Id, function(done) {
		request
		.get("/cache/truck/" + Invalid_Truck_Id)
		.expect(200)
		.end(function(err, fetched_truck) {
			should.not.exist(err);
            should.exist(fetched_truck.body);
            fetched_truck.body.should.not.have.property("location_id");
			done();
		})
	})
})

describe("Test Put /truck/location/:location_id/:latitude/:longitude", function() {
	it('should return updated truck with id: ' + Test_Truck_Id, function(done) {
		request.get("/truck/" + Test_Truck_Id).end(function(err, original_truck) {
			should.not.exist(err);
            var origin_latitude = parseFloat(original_truck.body.latitude);
            var origin_longitude = parseFloat(original_truck.body.longitude);
            var new_latitude = (origin_latitude + 0.00006).toString();
            var new_longitude = (origin_longitude - 0.00006).toString();
			request.put('/truck/location/' + Test_Truck_Id + '/' + new_latitude + '/' + new_longitude).end(function(put_err) {
                should.not.exist(put_err);
                request.get("/truck/" + Test_Truck_Id).end(function(get_err, updated_truck) {
                    should.not.exist(get_err);
                    Test_Truck_Id.should.equal(updated_truck.body.location_id);
                    new_latitude.should.equal(updated_truck.body.latitude);
                    new_longitude.should.equal(updated_truck.body.longitude);
                    done();
                    })
                })
		})
	})
})

describe("Test Put /cache/truck/location/:location_id/:latitude/:longitude", function() {
	it('should return updated truck with id: ' + Test_Truck_Id, function(done) {
		request.get("/cache/truck/" + Test_Truck_Id).end(function(err, original_truck) {
			should.not.exist(err);
            var origin_latitude = parseFloat(original_truck.latitude);
            var origin_longitude = parseFloat(original_truck.longitude);
            var new_latitude = (origin_latitude + 0.00006).toString();
            var new_longitude = (origin_longitude - 0.00006).toString();
			request.put('/cache/truck/location/' + Test_Truck_Id + '/' + new_latitude + '/' + new_longitude).end(function(put_err) {
                should.not.exist(put_err);
                request.get("/cache/truck/" + Test_Truck_Id).end(function(get_err, updated_truck) {
                    should.not.exist(get_err);
                    Test_Truck_Id.should.equal(updated_truck.body.location_id);
                    new_latitude.should.equal(updated_truck.body.latitude);
                    new_longitude.should.equal(updated_truck.body.longitude);
                    done();
                    })
                })
		})
	})
})

describe("Test GET /trucks/near/:latitude/:longitude/:maxDistance", function() {
	it('should return not empty trucks', function(done) {
		request.get("/trucks/near/" + Test_Latitude + '/' + Test_Longitude + '/' + Test_Distance).end(function(err, trucks) {
			should.not.exist(err);
            should.exist(trucks);
			trucks.body.length.should.above(0);
			done();
		})
	})

	it('should return empty truck list', function(done) {
		request.get("/trucks/near/" + 0 + '/' + 0 + '/' + 1).end(function(err, trucks) {
			should.not.exist(err);
            should.exist(trucks);
			trucks.body.length.should.equal(0);
			done();
		})
	})
})

function main() {
}

if (__filename == process.argv[1]) {
    main();
    test_server.db.close();
}
