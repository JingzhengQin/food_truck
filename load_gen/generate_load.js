var loadtest = require('loadtest');
var testing = require('testing');
var geolib = require('geolib');
var http = require('http');

var url_base = "http://localhost:3000";

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


function create_random_move_request(truck_data) {
	var d_lat = Math.floor(Math.random()*500+1) * 0.0000001;
	var d_long = Math.floor(Math.random()*500+1) * 0.0000001;
	var t_lat = parseFloat(truck_data.latitude) + d_lat;
	var t_long = parseFloat(truck_data.longitude) + d_long;

	truck_data.latitude = t_lat.toString();
    truck_data.longitude = t_long.toString();
    truck_data.location = {
	    "type": "Point",
	    "coordinates": [t_lat, t_long]
    };

	return "/truck/location/" + truck_data.location_id + "/" + t_lat + "/" + t_long;
}

function truck_movement_load_generator(callback)
{
	var start = 0;
	load_trucks(url_base + "/trucks", function (err, trucks_list) {
		if (err) {
			console.log(err);
			return;
		}

		var options = {
			url: url_base,
			method: 'PUT',
			//requestperSecond: 20,
			maxRequests: 100000,
			concurrency: 5,
			requestGenerator: function(params, options, client, callback)
			{
				
				options.host = "localhost";
				options.port = 3000;
				options.method = "PUT";
				request_index+=1;
				request_index = request_index%trucks_list.length;
				options.path = create_random_move_request(trucks_list[request_index]);

				var request = client(options, callback);
				request.end();
			},
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
	truck_movement_load_generator(function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		console.log(result);
	});
}
