var sleep = require('sleep');
var fs = require('fs');
var arrayUnion = require('array-union');

var geocoderProvider = 'google';
var httpAdapter = 'http'; 
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter);

var raw_truck_json = JSON.parse(fs.readFileSync('raw_truck_data.json'));

var column_map = {
	"location_id": 8,
	"applicant": 9,
    "facility_type": 10,
	"address": 13,
	"location_desc": 12,
	"food_items": 19,
	"latitude": 22,
	"longitude": 23
};

var food_trucks = [];
var food_trucks_without_lat_lng = [];

var total = 0;
var address_cnt = 0;
var lat_long_cnt = 0;

function convert_truck_row(raw_row) {
	var truck_row = {};

	for (var key in column_map) {
		truck_row[key] = raw_row[column_map[key]];
	}

	return truck_row;
}

function write_processed_truck_data(truck_data) {
    for (var i in truck_data) {
        truck_data[i].review_score = Math.floor(Math.random()*5+1);
        truck_data[i].location = {
            "type": "Point",
            "coordinates": [
                    parseFloat(truck_data[i].longitude),
                    parseFloat(truck_data[i].latitude),
                ]
        };
    }

    fs.writeFileSync("truck_data.json", JSON.stringify(truck_data));
}

function fetch_lat_lgn_recursive_and_store(current_pos) {
    if (current_pos<food_trucks_without_lat_lng.length) {
        geocoder.geocode(food_trucks_without_lat_lng[current_pos].address)
        .then(function(res) {
            sleep.sleep(2);
            food_trucks_without_lat_lng[current_pos].latitude = res[0].latitude;
            food_trucks_without_lat_lng[current_pos].longitude = res[0].longitude;
            console.log(current_pos);
            console.log(res);
            console.log(food_trucks_without_lat_lng[current_pos]);
            fetch_lat_lgn_recursive_and_store(current_pos+1);
        })
        .catch(function(err) {
           console.log(err);
        });
    } else {
        var trucks = arrayUnion(food_trucks, food_trucks_without_lat_lng);
        write_processed_truck_data(trucks);
    }
}


var raw_truck_data = raw_truck_json.data;
for (var i in raw_truck_data) {
	total++;
	var row = raw_truck_data[i];
	
	var has_address = row[column_map["address"]];
    if (has_address) {
    	address_cnt++;
    }

    var has_lat_lng = row[column_map["latitude"]] && row[column_map["longitude"]];
    if (has_lat_lng) {
    	lat_long_cnt++;
    }

    var truck = convert_truck_row(row);
    truck.address += " San Francisco, CA";
    if (has_address && has_lat_lng) {
    	food_trucks.push(truck);
    } else if (has_address) {
        food_trucks_without_lat_lng.push(truck);
    }
}

console.log("total rows: " + total + " rows with address: " + address_cnt + " rows with lat long: " + lat_long_cnt);

// back fill lat lgn data through google geo api
if (food_trucks_without_lat_lng.length > 0)
{
    fetch_lat_lgn_recursive_and_store(0);
} else {
	write_processed_truck_data(food_trucks);
}


// batch will easily exceed query limit
/*
geocoder.batchGeocode(['address1', 'another adress'], function (results) {
    console.log(results) ;
});
*/