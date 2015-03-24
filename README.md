Food Truck Finder
=================

This project allows you find food trucks by address/location. (currently only has data for San Francisco)

This project is currently host at [qinjingzheng.com:3000](http://qinjingzheng.com:3000). You can also find the source code at [JingzhengQin's github](https://github.com/JingzhengQin/food_truck)

The Food Truck Finder project is full stack project which contains two completely seperated parts: a) The front end is implemented base on [Backbone](http://backbonejs.org/) MVC. b) Back end uses [expreses](http://expressjs.com/) to provide RESTful APIs, and MongoDB for data storage.

Directories
-----------
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
