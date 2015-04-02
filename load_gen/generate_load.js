var loadtest = require('loadtest');
var testing = require('testing');
var geolib = require('geolib');
var http = require('http');

var test_host = "localhost";
var test_port = 3000;
var url_base = "http://" + test_host + ":" + test_port;

var cache_trucks = [];

var request_index = 0;

function load_trucks(url, callback) {
    http.get(url, function(res) {
        var body = "";
        res.on("data", function(chunk) {
            body += chunk;
        });
        res.on("end", function() {
            var truck_json = JSON.parse(body);
            callback(null, truck_json);
        });
        res.on("error", function(err) {
            callback(err);
        })
    });
}


function create_random_move_request(truck_data, move_range) {
	var d_lat = Math.floor(Math.random()*move_range-move_range/2) * 0.000001;
	var d_long = Math.floor(Math.random()*move_range-move_range/2) * 0.000001;
	var t_lat = parseFloat(truck_data.latitude) + d_lat;
	var t_long = parseFloat(truck_data.longitude) + d_long;

	truck_data.latitude = t_lat.toString();
    truck_data.longitude = t_long.toString();
    truck_data.location = {
	    "type": "Point",
	    "coordinates": [t_lat, t_long]
    };

	return truck_data.location_id + "/" + t_lat + "/" + t_long;
}

function truck_movement_load_generator(options, update_api_base, move_range, callback)
{
	var start = 0;
	load_trucks(url_base + "/trucks", function (err, trucks_list) {
		if (err) {
			console.log(err);
			return;
		}

		options.requestGenerator = function(params, options, client, callback)
			{
				
				options.host = test_host;
				options.port = test_port;
				options.method = "PUT";
				request_index+=1;
				request_index = request_index%(Math.floor(trucks_list.length / 3));
				options.path = update_api_base + create_random_move_request(trucks_list[request_index], move_range);

				var request = client(options, callback);
				request.end();
			};

		loadtest.loadTest(options, function(error, result)
		{
			if (error)
			{
				return callback('Could not run load test with requestGenerator');
			}

			return callback(null, 'requestGenerator succeeded: ' + JSON.stringify(result));
		});
	});
}


// start load test if invoked directly
if (__filename == process.argv[1])
{
	if ("move" == process.argv[2]) {

        var options = {
			url: url_base,
			method: 'PUT',
			equestsPerSecond: 200,
			concurrency: 1,
		};

		truck_movement_load_generator(options, "/cache/truck/location/", 1000, function(err, result) {
			if (err) {
				return console.log(err);
			}

			console.log(result);
		});
		return;
	}

    var options = {
			url: url_base,
			method: 'PUT',
			maxRequests: 100000,
			concurrency: 50,
		 };

	console.log("Starting load test against " + url_base + "/truck/location/");
	truck_movement_load_generator(options, "/truck/location/", 1000, function(err, result) {
		if (err) {
			return console.log(err);
		}

		console.log(result);
		console.log("Starting load test against " + url_base + "/cache/truck/location/");
		truck_movement_load_generator(options, "/cache/truck/location/", 1000, function(err, result) {
			if (err) {
				return console.log(err);
			}

			console.log(result);
		});
	});
}
