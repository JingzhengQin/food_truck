var express = require('express');
var path = require('path');
var mongo = require('mongodb');
var monk = require('monk');
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
