var fs = require('fs');
var monk = require('monk');
var db = monk('localhost:27017/food_truck');
var collection = db.get("truckscollection");

var food_trucks = JSON.parse(fs.readFileSync('truck_data.json'));

collection.drop();

var promise = collection.insert(food_trucks);

promise.error(function(err){
	console.log(err);
	db.close();
});

promise.success(function(doc){
	console.log("Bingo!");
	collection.ensureIndex( { location: "2dsphere" }, function (err, result) {
		if (err) console.log(err);
		db.close();
	});
	
});