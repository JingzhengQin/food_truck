var sleep = require('sleep');
var http = require('http');
var fs = require('fs');
var arrayUnion = require('array-union');

var geocoderProvider = 'google';
var httpAdapter = 'http'; 
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter);

/**
 * =================================================================
 * Only select the fields we care about.
 * Key is the column name in parsed json, value indicates
 * the position of the values in raw json.
 * =================================================================
 */

var file_column_map = {
	"location_id": 8,
	"applicant": 9,
    "facility_type": 10,
	"address": 13,
	"location_desc": 12,
	"food_items": 19,
	"latitude": 22,
	"longitude": 23
};

/**
 * ============================================
 * The json format from http request and 
 * the format of json file download directly 
 * via the sf gov website are different
 * we use two mapper to unifiy them
 * ============================================
 */

var http_column_map = {
    "location_id": "objectid",
    "applicant": "applicant",
    "facility_type": "facilitytype",
    "address": "address",
    "location_desc": "locationdescription",
    "food_items": "fooditems",
    "latitude": "latitude",
    "longitude": "longitude"
};

/**
 * ===================================================================
 * Helper function to convert raw truck raw to structed truck object
 * e.g.
 * a truck raw in row data: 
 * { 
 *    0: 3493784,
 *    1: "ApplicantName",
 *    2: "1285.83843,
 *    ... 
 * } 
 * after convertion:
 * {
 *           _id: 73274,
 *     applicant: "Hello world truck",
 *     ...   
 * }
 * ====================================================================
 */

function convert_truck_row(raw_row, column_map) {
	var truck_row = {};

	for (var key in column_map) {
		truck_row[key] = raw_row[column_map[key]];
	}

	return truck_row;
}

/**
 * ==================================================================================
 * Use chained style async callback to fetch lat lng for a given truck list
 * so that we gain benefit of async and reduced complexity of handling concurrency
 * Note: there is a batchGeocode API, however, there is usage limit for free user.
 * ==================================================================================
 */

function fetch_lat_lgn_chain(food_trucks_without_lat_lng, current_pos, callback) {
    if (current_pos<food_trucks_without_lat_lng.length) {
        geocoder.geocode(food_trucks_without_lat_lng[current_pos].address)
        .then(function(res) {

            // Because there is usage limit for free user, so limiting the query speed here
            sleep.sleep(1);
            food_trucks_without_lat_lng[current_pos].latitude = res[0].latitude;
            food_trucks_without_lat_lng[current_pos].longitude = res[0].longitude;
            fetch_lat_lgn_chain(food_trucks_without_lat_lng, current_pos+1, callback);
        })
        .catch(function(err) {
           console.log(err);
           callback(err);
        });
    } else {
        callback(null, food_trucks_without_lat_lng);
    }
}

/**
 * ==============================================================
 * Proxy function of fetch_lat_lgn_chain with simpler interface
 * ==============================================================
 */

function fetch_lat_lgn(food_trucks_without_lat_lng, callback) {
    fetch_lat_lgn_chain(food_trucks_without_lat_lng, 0, callback);
}

/**
 * ===============================================
 * Enrich truck data
 * ===============================================
 */

function enrich_truck_data(truck_data) {
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

    return truck_data;
}

/**
 * ==========================================
 * Dedupe truck data base on truck id
 * ==========================================
 */

function dedupe_truck_data(truck_data) {
    var uniq_ids = {};
    var uniq_truck_data = [];
    for (var i in truck_data) {
        var id = truck_data[i].location_id;
        if (uniq_ids[id] !== true) {
            uniq_ids[id] = true;
            uniq_truck_data.push(truck_data[i]);
        }
    }

    return uniq_truck_data;
}

/**
 * =========================================
 * Main entry to process raw truck data
 * =========================================
 */

function process_raw_truck_data(raw_truck_json, column_map, callback) {
    var food_trucks = [];
    var food_trucks_without_lat_lng = [];

    var total = 0;
    var address_cnt = 0;
    var lat_long_cnt = 0;

    var raw_truck_data = raw_truck_json;

    // Collect some statistic info, so that we have a rough idea about the data quality
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

        var truck = convert_truck_row(row, column_map);
        truck.address += " San Francisco, CA";
        if (has_address && has_lat_lng) {
        	food_trucks.push(truck);
        } else if (has_address) {
            food_trucks_without_lat_lng.push(truck);
        }
    }
    console.log("total rows: " + total + " rows with address: " + address_cnt + " rows with lat long: " + lat_long_cnt);

    // back fill lat lgn data through google geo api
    fetch_lat_lgn(food_trucks_without_lat_lng, function(err, additional_food_trucks_with_lat_lng) {
        if (err) {
            callback(err);
            return;
        }

        var trucks = arrayUnion(food_trucks, additional_food_trucks_with_lat_lng);
        var enriched_trucks = enrich_truck_data(trucks);
        var deduped_trucks = dedupe_truck_data(enriched_trucks);

        fs.writeFileSync("truck_data.json", JSON.stringify(deduped_trucks));
        callback(null, deduped_trucks);
    });
}

/**
 * ========================================================
 * Load raw json data from remote resource
 * e.g. http://data.sfgov.org/resource/rqzj-sfat.json
 * ========================================================
 */

exports.process_truck_data_from_http = function (url, callback) {
    http.get(url, function(res) {
        var body = "";
        res.on("data", function(chunk) {
            body += chunk;
        });
        res.on("end", function() {
            var raw_truck_json = JSON.parse(body);
            process_raw_truck_data(raw_truck_json, http_column_map, function(err, processed_truck_data) {
                callback(err, processed_truck_data);
            });
        });
        res.on("error", function(err) {
            callback(err);
        })
    });
}

/**
 * =============================================
 * Load raw json data from raw_truck_data.json
 * e.g. raw_truck_data.json
 * =============================================
 */

exports.process_truck_data_from_file = function (file_path, callback) {
    var raw_truck_json = JSON.parse(fs.readFileSync(file_path));
    process_raw_truck_data(raw_truck_json.data, file_column_map, callback);
}