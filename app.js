var express = require('express');
var path = require('path');
var mongo = require('mongodb');
var monk = require('monk');
var geolib = require('geolib');
var truck_data_processor = require('./data_process/parse_raw_truck_data.js');
var db = monk('localhost:27017/food_truck');
var collection = db.get("truckscollection");
var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var routes = require('./routes/index');

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    req.truck_collection = collection;
    next();
});


// cache trucks info
var cached_trucks = {};
var original_truck_coordinates = {};
var Max_Cache_Distance = 100; // meters

/**
 * ============================================================
 * Utility functions for mongodb access, cache operations, etc
 * ============================================================
 */

function calculate_distance(latitude1, longitude1, latitude2, longitude2) {
    return geolib.getDistance(
    {latitude: parseFloat(latitude1), longitude: parseFloat(longitude1)},
    {latitude: parseFloat(latitude2), longitude: parseFloat(longitude2)});
}

function chained_bulk_update(truck_data, current_pos, callback) {
    if (current_pos<truck_data.length) {

        var new_truck = truck_data[current_pos];
        var truck_id = new_truck.location_id.toString();
        var p = collection.update({"location_id": truck_id}, { $set: new_truck }, { upsert: true });
        p.complete(function (err) {
            if (err) {
                callback(err);
                return;
            }
            
            bulk_update(truck_data, current_pos+1, callback);
        });
    } else {
        callback(null);
    }
}

function refresh_cached_trucks(callback) {
   collection.find({}, function (err, results) {
       if (err) {
           return callback(err);
       }
       else {
           var new_cached_trucks = {};
           for (var i=0; i<results.length; i++) {
               var new_truck = results[i];
               new_cached_trucks[new_truck.location_id] = new_truck;
           }

           cached_trucks = new_cached_trucks;
           original_truck_coordinates = {};
           callback(null);
       }
    });
}

function update_truck_location_mongodb(location_id, latitude, longitude, callback) {
    var update_data = {
        "latitude": latitude,
        "longitude": longitude,
        "location": {
            "type": "Point",
            "coordinates": [parseFloat(longitude), parseFloat(latitude)]
        }
    }

    var p = collection.update( {"location_id": location_id}, { $set: update_data }, { upsert: true });
    p.complete(function (err) {
            if (err) {
                return callback(err);
            }
            callback(null);
        });
   
}

var total_hit = 0;
var total_miss = 0;
function update_truck_location_cached(location_id, latitude, longitude, callback) {
    get_truck_info_cached(location_id, function(err, truck_data) {
        if (err) {
            return callback(err);
        }

        var original_coordinate = original_truck_coordinates[location_id];
        if (!original_coordinate) {
            original_coordinate = {
                "latitude": latitude,
                "longitude": longitude
            };
            original_truck_coordinates[location_id] = original_coordinate;
        }

        truck_data.latitude = latitude;
        truck_data.longitude = longitude;
        truck_data.location = {
            "type": "Point",
            "coordinates": [parseFloat(longitude), parseFloat(latitude)]
        }

        if (calculate_distance(original_coordinate.latitude, original_coordinate.longitude, latitude, longitude) > Max_Cache_Distance) {
            update_truck_location_mongodb(location_id, latitude, longitude, function(err) {
                if (err) {
                    return callback(err);
                }
                
                original_truck_coordinates[location_id] = {
                "latitude": latitude,
                "longitude": longitude
                };

                return callback(null);
            });   
        } else {
            return callback(null);
        }
    });
}
   
function get_truck_info_mongodb(location_id, callback) {
    collection.findOne( {"location_id": location_id}, function (err, doc) {
        if (err) {
            return callback(err);
        }

        callback(null, doc);
    });
}

function get_truck_info_cached(location_id, callback) {
    var truck_data = cached_trucks[location_id];
    if (truck_data) {
        return callback(null, truck_data);
    }

    get_truck_info_mongodb(location_id, function(err, doc) {
         if (err) {
             return callback(err);
         }

         cached_trucks[location_id] = doc;
         callback(null, doc);
    });
}



app.use(express.static('public'));
app.use('/help', routes);
    
app.get('/refresh', function(req, res, next) {
    truck_data_processor.process_truck_data_from_http('http://data.sfgov.org/resource/rqzj-sfat.json', function(err, truck_data) {
        if (err) {
            return next(err);
        }

        chained_bulk_update(truck_data, 0, function(err) {
            if (err) {
                return next(err);
            }

            refresh_cached_trucks(function(err) {
                if (err) {
                    return next(err);
                }

                return res.json({"status": "success"});
            });
            
        });
    });
});

app.get('/truck/:location_id', function (req, res, next) {
    var location_id = req.params.location_id;
    get_truck_info_mongodb(location_id, function (err, doc) {
        if (err) {
            return next(err);
        }
        return res.json(doc);
    });
});

app.get('/cache/truck/:location_id', function (req, res, next) {
    var location_id = req.params.location_id;
    get_truck_info_cached(location_id, function (err, doc) {
        if (err) {
            return next(err);
        }

        return res.json(doc);
    });
});

app.put('/truck/location/:location_id/:latitude/:longitude', function (req, res, next) {
    var location_id = req.params.location_id;
    var latitude = req.params.latitude;
    var longitude = req.params.longitude;

    update_truck_location_mongodb(location_id, latitude, longitude, function(err) {
        if (err) {
            return next(err);
        }

        return res.json({"status": "success"});
    });
});

app.put('/cache/truck/location/:location_id/:latitude/:longitude', function (req, res, next) {
    var location_id = req.params.location_id;
    var latitude = req.params.latitude;
    var longitude = req.params.longitude;

    update_truck_location_cached(location_id, latitude, longitude, function(err) {
        if (err) {
            return next(err);
        }

        return res.json({"status": "success"});
    });
});

app.get('/trucks', function (req, res, next) {
    var result_trucks = [];
    for (var key in cached_trucks) {
        result_trucks.push(cached_trucks[key]);
    }
    res.json(result_trucks);
});

app.get('/trucks/near/:latitude/:longitude/:maxDistance', function (req, res, next) {
    var latitude = parseFloat(req.params.latitude);
    var longitude = parseFloat(req.params.longitude);
    var maxDistance = parseInt(req.params.maxDistance);

    collection.find({
        location: {
            "$near": {
                "$geometry": {
                    "type": "Point",
                    "coordinates": [longitude, latitude]
                },
                "$maxDistance": maxDistance
            }
        }
    }, {"limit": 50, "sort": "review_score"}, function (err, results) {
        if (err) {
            next(err);
        }
        else {
            res.json(results);
        }
    });
});

app.use(function(req, res, next) {
    console.log(req.url);
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

refresh_cached_trucks(function(err) {
    if (err) {
        throw new Error("Failed to refresh cached trucks. " + err.message);
    }

    var server = app.listen(3000, function () {

      var host = server.address().address
      var port = server.address().port

      console.log('Food Truck Finder listening at http://%s:%s', host, port)

    });
});

