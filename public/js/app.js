var App = null;

/**
 * The AppView
 */

 var AppView = Backbone.View.extend({

    el:  $("#search-panel"),


    find_food_trucks_near: function() {
        var address = $('#search-address').val();
        if (!address) {
            alert("Please enter address. (e.g. 1 DRUMM ST, San Francisco)");
            return;
        }

        // Get location by address from geocode, then re-render the view
        App.google_geocoder.geocode( {'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var location = results[0].geometry.location;
                var lat = location.lat();
                var lng = location.lng();
                App.list_view.requery_trucks_near(lat, lng, 1000);
                App.map.setCenter(location);
                App.map.setZoom(16);

            } else {
                alert("Failed to get location from google: " + status);
            }
        });

    },


    initialize_google_map : function() {
      var center = new google.maps.LatLng(37.763, -122.43); //SF

      var main_color = '#2d313f',
      saturation_value= -20,
      brightness_value= 5;

      var styles = [
      {
          featureType: 'road.highway',
          elementType: 'labels',
          stylers: [ {visibility: "off"} ]
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [
        { visibility: "on" },
        { lightness: brightness_value },
        { saturation: saturation_value }
        ]
    },
    ];


    var mapOptions = {
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: center,
      styles: styles
  };

  this.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
},

    initialize: function() {
      this.map_canvas = $('#map_canvas');
      this.search_address = $('#search-address');
      this.search_button = $('#search-button');
      this.search_button.on('click', this.find_food_trucks_near);
      this.search_address.on('change', this.find_food_trucks_near);
      this.google_geocoder = new google.maps.Geocoder();

      this.initialize_google_map();
      var trucks = new TruckList({ latitude: 37.763, longitude: -122.43, maxDistance: 10000 });
      var that = this;
      trucks.fetch({
        success: function() {
            that.list_view = new TruckListView({model: trucks, map: that.map});
            }
      });
}
});

$(function() {
  App = new AppView();
});
