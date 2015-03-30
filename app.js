var express = require('express');
var path = require('path');
var mongo = require('mongodb');
var monk = require('monk');
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
    req.collection = db;
    next();
});

app.use(express.static('public'));

app.use('/help', routes);

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
    
app.get('/refresh', function(req, res, next) {
    truck_data_processor.process_truck_data_from_http('http://data.sfgov.org/resource/rqzj-sfat.json', function(err, truck_data) {
        if (err) {
            next(err);
            return;
        }

        chained_bulk_update(truck_data, 0, function(err) {
            if (err) {
                next(err);
                return;
            }

            res.json({"status": "success"});
        });
    });
});

app.get('/truck/:location_id', function (req, res, next) {
    var location_id = req.params.location_id;
    collection.findOne( {"location_id": location_id}, function (err, doc) {
        if (err) {
            next(err);
            return;
        }

        res.json(doc);
    });
});

app.put('/truck/:location_id/:latitude/:longitude', function (req, res, next) {
    var location_id = req.params.location_id;
    var latitude = req.params.latitude;
    var longitude = req.params.longitude;

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
                callback(err);
                return;
            }
            
            res.json({"status": "success"});
        });
});

app.get('/trucks', function (req, res, next) {
    collection.find({}, function (err, results) {
        if (err) {
            next(err);
        }
        else {
            res.json(results);
        }
    });
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


var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
