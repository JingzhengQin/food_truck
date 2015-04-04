Food Truck Finder
=================

This project allow users to search food trucks nears a given address. Food trucks can be moving to different places during different hours. So updating user with latest food truck information in real-time is also important. So this project also provide APIs for food truck owners to update their current location to users in real-time. However, updating food truck location can be expensive because of index update, especially when we want to provide users food truck near real-time (no delay/very small delay) location. To acheive this goal, I added a cache layer which only updates index when a food truck has moved more than a configuarable distance. I think it's unnessary to update index for every meter movement because when user will get a range anyway when they query food trucks near a specific location. All Get/Set operations will talk to cache first so that user can see trucks are moving in real-time and we reduced get/set/indexing pressure to db without delaying the latest location infomation. Load test results shows that we can support ~50% more rps with ~30% less cpu usage on a 4 cores Xeon 3.0GHz 64-bit ubuntu machine. Latency is about the same because most of cost is on networking. 

The Food Truck Finder project is currently hosting at AWS EC2: [foodtruck.qinjingzheng.com](http://foodtruck.qinjingzheng.com). You can also find the source code at [JingzhengQin's github](https://github.com/JingzhengQin/food_truck)


This project is a full stack project which contains following parts:

  a) UI: I uses [Backbone](http://backbonejs.org/) as base framework. google map as basic platform to display food trucks and map operations; some bootstrap css. I'm using Backbone in this project because it's light weight, has clean MVC, many libaries/tools support from the community.
  
  b) Backend I uses [expreses](http://expressjs.com/) to provide RESTful APIs to operate truck and refresh trucks data in bulk. I select node because we automatically gain benifits from async, this is important for web service performance; and I can reuse javascript components everywhere.
  
  c) I selected MongoDB for data storage because it supports a sample way for geo indexing; data can be store in json format; and flexible query commands, and it's fast! truck_data_offline contains node scripts to sanitize/enrich raw data. some data is missing location information, use google map api to fill the column via address.
  
  d) [mocha](https://github.com/mochajs/mocha), [should](https://www.npmjs.com/package/should), [supertest](https://github.com/visionmedia/supertest) for API integration test.

The major consideration for above tech stack is light weight, high performance, and great support from community. Light weight can reduce a lot development pain like configuration, deployments, etc. and the overrall structure is simple and easy to extend. High performance is always important for large scale real-time web service. And I think community support is another way of reusability, we should always avoid doing duplicated works when it's possible beacuse development time also has big impacts to business. 

I actually have very little experience with techologies I mentioned above, but I like to choose proper framwork/tools to accelerate the development process, easier integration (backbone is suggested by the challenge), and showoff my fast learning skill.

APIs Documentation
-------------------
http://foodtruck.qinjingzheng.com/doc/

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

Directories
-----------
```
├── app.js                                // Back end node server;
├── data_process                          // Contains all data processing files (node scripts)
│   ├── ingest_trucks_data.js             // Ingest truck data into mongoDB. input: truck_data.json output: mongoDB collection
│   ├── parse_raw_truck_data.js           // Parse raw truck data from [SF food truck](https://data.sfgov.org/Economy-and-Community/Mobile-Food-Facility-Permit/rqzj-sfat?) input: raw_truck_data.json output: truck_data.json
│   ├── raw_truck_data.json
│   └── truck_data.json
├── load_gen
│   └── generate_load.js                 // Load test and food truck movement load generator
├── package.json                         // Node dependencies
├── public                               // Front end html/javascript/css/image files are here. It can be host anywhere.
│   ├── css
│   │   ├── app.css
│   │   └── lib                          // css libraries
│   │       ├── animation.css
│   │       └── bootstrap.css
│   ├── images
│   │   ├── cart-icon.png
│   │   ├── food_truck.png
│   │   ├── icon-truck.png
│   │   ├── truck_1.png
│   │   ├── truck_2.png
│   │   ├── truck_3.png
│   │   ├── truck_4.png
│   │   └── truck_5.png
│   ├── index.html                      // Main page
│   └── js
│       ├── app.js                      // Application main view extend from backbone
│       ├── collections 
│       │   └── truck_list.js           // Abstraction of truck collection
│       ├── lib                         // Libraries
│       │   ├── backbone.googlemaps.js
│       │   ├── backbone-min.js
│       │   ├── bootstrap.js
│       │   ├── jquery.js
│       │   ├── markerAnimate.js
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
│   └── index.js
├── tests
│   └── truck_service_test.js            // APIs test
└── views                                // Jade templates for back end node server
    ├── error.jade
    ├── index.jade
    └── layout.jade

```
