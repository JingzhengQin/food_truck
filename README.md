Food Truck Finder
=================

This project allows you find food trucks by address/location. (currently only has data for San Francisco)

This project is currently host at [qinjingzheng.com:3000](http://qinjingzheng.com:3000). You can also find the source code at [JingzhengQin's github](https://github.com/JingzhengQin/food_truck)

The Food Truck Finder project is full stack project which contains two parts: a) The front end is implemented base on [Backbone](http://backbonejs.org/) MVC. b) Back end uses [expreses](http://expressjs.com/) to provide RESTful APIs, and MongoDB for data storage. I selected these source as tech stack because they're very light weight. All javascript for front end, back end, and data processing so that we can share common code.

Usage
-----

Open the hosting url. The page will pre-load some high rating food trucks within SF. 

Move mouse to search result side bar (right side) or food truck's google map marker to view detail information of the food truck.

Type any address within SF into search box and hit enter/search button to find food trucks near the input location.

Installation
------------
1. Download the project.
2. Go to root of the project and type `npm install` to install all dependencies.
3. `node app.js` to start the app.

Front End
---------
Front end is based on backbone MVC framework. 
* Data model and view rendering are decoupled.
* Integrate data model with RESTful APIs makes data operation clean.
* OO style pattern makes it easy to understand/write/extend the code base.
* Many libaries from open source community like google map backbone lib.

All front end files are in public folder. It can be hosted anywhere with any framework. (In this project, I use express to host the files)

AppView in app.js is the main view of the application, contains google map. The structures is very simple, I believe most code are self-explained.

These features can be easily support by the current framework if have time:
* food truck realtime update/insert/delete by adding update/insert/delete functions to Truck model.
* food truck gps location realtime tracking by adding location function to Truck model and event listener to googleMap model.
* online ordering by adding ordering view and event listener to truck view.
* and more...

How to Install: host the public files.

Back End
--------
Back end RESTful APIs to access food trucks data based on node express framework.
It provides APIs to access trucks data in mongoDB.
```
Get /            // Documentation page

GET /trucks      //Return all trucks

GET /trucks/near/:latitude/:longitude/:maxDistance            // Return trucks near location (latitude, longitude) within maxDistance
```

Data Storage and Processing
---------------------------
MongoDB is selected for data storage stack because:
* Data in Jason format, which is consistent throughout the project.
* It supports geospatial indexing and it's effient.
* Flexible query options e.g. sort, limit, etc.
 
truck_data_offline contains node scripts to sanitize/enrich raw data.

parse_raw_truck_data:
    1. filter unneed column.
    2. some data is missing location information, use google map api to fill the column via address. 
    3. enrich data by faking ratings to support more functionalities.


Directories
-----------
```
.
├── app.js                               // Back end node server;
├── package.json                         // Node dependencies
├── public                               // Front end html/javascript/css/image files are here. It can be host anywhere.
│   ├── css
│   │   ├── app.css
│   │   └── lib                          // css libraries
......
│   ├── images
......
│   ├── index.html                       // Main page
│   └── js
│       ├── app.js                       // Application main view extend from backbone
│       ├── collections
│       │   └── truck_list.js            // Abstraction of truck collection
│       ├── lib                          // Libraries
│       │   ├── backbone.googlemaps.js
│       │   ├── backbone-min.js
│       │   ├── bootstrap.js
│       │   ├── jquery.js
│       │   ├── markermanager.js
│       │   └── underscore.js
│       ├── models
│       │   └── truck.js                 // Truck backbone model
│       └── views
│           ├── truck_list_item_view.js  // Backbond view represents a single row in search result side bar  
│           ├── truck_list_view.js       // Backbond view represents search result side bar
│           └── truck_marker_view.js     // Backbond view represents marker in google map
├── README.md                            // Help document
├── routes
│   └── index.js                         // Doucument page for backend node service
├── truck_data_offline                   // Contains all offline processing files (node scripts)
│   ├── ingest_trucks_data.js            // Ingest truck data into mongoDB. input: truck_data.json output: mongoDB collection
│   ├── parse_raw_truck_data.js          // Parse raw truck data from [SF food truck](https://data.sfgov.org/Economy-and-Community/Mobile-Food-Facility-Permit/rqzj-sfat?) input: raw_truck_data.json output: truck_data.json
│   ├── raw_truck_data.json
│   └── truck_data.json
└── views                                // Jade templates for back end node server
    ├── error.jade
    ├── index.jade
    └── layout.jade
```

