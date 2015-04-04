define({ "api": [
  {
    "type": "get",
    "url": "/trucks",
    "title": "Get all trucks from cache",
    "version": "0.0.1",
    "name": "GetAllTrucks",
    "group": "Truck",
    "description": "<p>Get all trucks from cache</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/trucks",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "Trucks",
            "description": "<p>A list of trucks (Array of Object) see GetTruck for truck&#39;s structure</p> "
          }
        ]
      }
    },
    "filename": "./app.js",
    "groupTitle": "Truck"
  },
  {
    "type": "get",
    "url": "/cache/truck/:location_id",
    "title": "Get detail of a Truck from cache",
    "version": "0.0.1",
    "name": "GetTruck",
    "group": "Truck",
    "description": "<p>Get cached truck detail information by location_id</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "location_id",
            "description": "<p>The Truck&#39;s location id.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/cache/truck/305709",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "truck",
            "description": "<p>The Truck with input location id.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "truck.location_id",
            "description": "<p>The Truck location ID.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "truck.applicant",
            "description": "<p>Truck name</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "truck.address",
            "description": "<p>Address of the truck.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "truck.location_desc",
            "description": "<p>Detailed description of the address</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "truck.food_items",
            "description": "<p>Selling items of the food truck</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "truck.latitude",
            "description": "<p>Current latitude of the food truck</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "truck.longitude",
            "description": "<p>Current longitude of the food truck</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "truck.review_score",
            "description": "<p>Rating of the food truck</p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "InternalError",
            "description": "<p>Internal Service Error</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 500 Service Unavailable\n{\n  \"error\": \"InternalError\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./app.js",
    "groupTitle": "Truck"
  },
  {
    "type": "get",
    "url": "/truck/:location_id",
    "title": "Get detail of a Truck",
    "version": "0.0.1",
    "name": "GetTruckNonCache",
    "group": "Truck",
    "description": "<p>Get truck detail information from db by location_id. Note: Prefer use cached version, leave this here API for performance test purpose</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "location_id",
            "description": "<p>The Truck&#39;s location id.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/truck/305709",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "truck",
            "description": "<p>The Truck with input location id.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "truck.location_id",
            "description": "<p>The Truck location ID.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "truck.applicant",
            "description": "<p>Truck name</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "truck.address",
            "description": "<p>Address of the truck.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "truck.location_desc",
            "description": "<p>Detailed description of the address</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "truck.food_items",
            "description": "<p>Selling items of the food truck</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "truck.latitude",
            "description": "<p>Current latitude of the food truck</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "truck.longitude",
            "description": "<p>Current longitude of the food truck</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "truck.review_score",
            "description": "<p>Rating of the food truck</p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "InternalError",
            "description": "<p>Internal Service Error</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 500 Service Unavailable\n{\n  \"error\": \"InternalError\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./app.js",
    "groupTitle": "Truck"
  },
  {
    "type": "get",
    "url": "/trucks/near/:latitude/:longitude/:maxDistance",
    "title": "Search trucks near a given location",
    "version": "0.0.1",
    "name": "GetTrucksByLocation",
    "group": "Truck",
    "description": "<p>Search trucks near a given location within maxDistance</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "latitude",
            "description": "<p>latitude of new truck location</p> "
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "longitude",
            "description": "<p>longitude of new truck location</p> "
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "maxDistance",
            "description": "<p>the max distance of trucks to return</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/near/37.283/-122.474667/10000",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "Trucks",
            "description": "<p>a list of trucks (Array of Object) see GetTruck for truck&#39;s structure</p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "InternalError",
            "description": "<p>Internal Service Error</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 500 Service Unavailable\n{\n  \"error\": \"InternalError\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./app.js",
    "groupTitle": "Truck"
  },
  {
    "type": "get",
    "url": "/refresh",
    "title": "Refresh food trucks data",
    "version": "0.0.1",
    "name": "Refresh",
    "group": "Truck",
    "description": "<p>Refresh truck data with sfgov.org info to keep data up to date Note: take argument to get data from different source if needed. We only have single source for now.</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/refresh",
        "type": "json"
      }
    ],
    "filename": "./app.js",
    "groupTitle": "Truck"
  },
  {
    "type": "put",
    "url": "/cache/truck/location/:location_id/:latitude/:longitude",
    "title": "Update truck location from cache",
    "version": "0.0.1",
    "name": "UpdateTruckLocation",
    "group": "Truck",
    "description": "<p>Update truck location infomation</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "location_id",
            "description": "<p>Identify the truck that need to be update</p> "
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "latitude",
            "description": "<p>latitude of new truck location</p> "
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "longitude",
            "description": "<p>longitude of new truck location</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/cache/truck/location/305709/37.283/-122.474667",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>success stauts</p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "InternalError",
            "description": "<p>Internal Service Error</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 500 Service Unavailable\n{\n  \"error\": \"InternalError\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./app.js",
    "groupTitle": "Truck"
  },
  {
    "type": "put",
    "url": "/truck/location/:location_id/:latitude/:longitude",
    "title": "Update truck location",
    "version": "0.0.1",
    "name": "UpdateTruckLocationNonCache",
    "group": "Truck",
    "description": "<p>Non-Cached version update truck location, This API access db directly. Note: Prefer use cached version, leave this here API for performance test purpose</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "location_id",
            "description": "<p>Identify the truck that need to be update</p> "
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "latitude",
            "description": "<p>latitude of new truck location</p> "
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "longitude",
            "description": "<p>longitude of new truck location</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/truck/location/305709/37.283/-122.474667",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>success stauts</p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "InternalError",
            "description": "<p>Internal Service Error</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 500 Service Unavailable\n{\n  \"error\": \"InternalError\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./app.js",
    "groupTitle": "Truck"
  }
] });