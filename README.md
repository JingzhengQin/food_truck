Food Truck Finder
=================

This project provides users ability to food food trucks nears a given address. Food truck can be moving to different places during different hours. So updating user with latest food truck information in real-time is also important. This food truck finder project also provide APIs to allow food truck owner to update current status to users in real-time. However, updating food truck location can be expensive during to index update, especially when we want to provide users food truck real-time (no delay/very small delay) location. I added a cache layer to so that we can reduce pressure to db without delaying the latest location infomation. Load test result shows that we can support ~50% more rps with ~30% less cpu usage. Latency is about the same, because most of cost is on networking. 

The Food Truck Finder project is currently hosting at AWS EC2: [foodtruck.qinjingzheng.com](http://foodtruck.qinjingzheng.com). You can also find the source code at [JingzhengQin's github](https://github.com/JingzhengQin/food_truck)

This project is a full stack project which contains following parts:
  a) UI: I uses [Backbone](http://backbonejs.org/) as base framework. backbone.googlemaps to display food trucks and map operations; some bootstrap css.
  
  b) Backend uses [expreses](http://expressjs.com/) to provide RESTful APIs to operate truck and refresh trucks data in bulk. We gain benifit from async by default; and I can reuse javascript components everywhere.
  
  c) I selected MongoDB for data storage because it supports a sample way for geo indexing; data can be store in json format; and flexible query commands.
  
  d) [mocha](https://github.com/mochajs/mocha), [should](https://www.npmjs.com/package/should), [supertest](https://github.com/visionmedia/supertest) for API integration test.

I have little/no experience with techology I mention above, but I like to choose proper framwork/tools to accelerate the development process, easier integration (backbone is suggested by the challenge), and showoff my fast learning skill.

Usage
-----

Open [foodtruck.qinjingzheng.com](http://foodtruck.qinjingzheng.com). The page will pre-load some high rating food trucks in SF. Select a food truck which you interested in search result side bar (right side) and it'll focus to corresponding google map marker with a food truck detail popup.

Type a address (e.g. 85 02ND ST San Francisco, CA) within SF in the search box and hit enter/search button, a list of food trucks near the input location will be returned.

You'll also see some food truck is moving around in real-time to give you latest information. 

I'm using a simple load generator at backend to simulate the truck location update request. so you may see some trucks might move to some impossible places (it wont happend in real world).

Installation
------------
1. Download the project and make sure you have [node/npm](https://www.digitalocean.com/community/tutorials/how-to-install-express-a-node-js-framework-and-set-up-socket-io-on-a-vps), [mongoDB](https://www.mongodb.org/) installed in your machine.
2. Go to root of the project and type `npm install` to install all dependencies.
4. `node app.js` to start the app.

How to ingest truck data
------------------------
goto data_process folder and execute `node ingest_trucks_data.js` to ingest the data.
we can also call /refresh API to refresh truck data from http://data.sfgov.org/resource/rqzj-sfat.json. I think a daily cron job should be enough because the data is not changing very frequently from sfgov website.

How to start load to simulate truck movement
---------------------------------------------
Go to load_gen folder and run `node generate_load.js move`; it'll start simulating trucks movement requests againest local server

How to run tests
----------------
Go to test folder and run `node truck_service_test.js`; and [mocha](https://github.com/mochajs/mocha) style output will tell you test results. 

Front End
---------
Front end is based on backbone MVC framework. 
* Data model and view rendering are decoupled.
* Integrate data model with RESTful APIs makes data operation clean.
* OO style pattern makes it easy to understand/write/extend the code base.
* Many libaries from open source community like google map backbone lib.

All front end files are in public folder. It can be hosted anywhere with any framework. (In this project, I use express to host the files)

AppView in app.js is the main view of the application, contains google map.


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

