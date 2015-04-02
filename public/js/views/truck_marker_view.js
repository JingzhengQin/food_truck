
/**
 * Truck Marker View
 */

var TruckMarkerView = Backbone.View.extend({

    initialize: function(options) {
      this.model = options.model;
      this.model.on('remove', this.remove, this);
      this.map = options.map;

      var latitude = parseFloat(this.model.get('latitude'));
      var longitude = parseFloat(this.model.get('longitude'));
      this.marker = new google.maps.Marker({
          map: this.map,
          position: new google.maps.LatLng(latitude, longitude),
          animation: google.maps.Animation.DROP,
          icon : 'images/food_truck.png',
          title: this.model.get("applicant"),
          id : this.model.get('location_id')
      });
      
      // Render truck info html for marker
      var tmpl = _.template($('#truck-info-window-template').html());
      var image_src = "images/truck_" + Math.floor(Math.random()*5+1) + ".png";
      var truck_info = tmpl({
          applicant: this.model.get("applicant"),
          facility_type: this.model.get("facility_type"),
          address: this.model.get("address"),
          food_items: this.model.get("food_items"),
          location_desc: this.model.get("location_desc"),
          location_id: this.model.get("location_id"),
          image_src: image_src
      });

      this.marker.infowindow = new google.maps.InfoWindow({
        content: truck_info
      });
      google.maps.event.addListener(this.marker, 'mouseover', this.show_truck_info);
      google.maps.event.addListener(this.marker, 'mouseout', this.hide_truck_info);

      var that = this;
      this.refresh_interval = setInterval( function() {
        that.update_location(that.model)
      }, 1500);
    },

    hide_truck_info : function() {
      this.setIcon('images/food_truck.png');
      this.infowindow.close();
    },

    show_truck_info : function() {
      this.setIcon('images/food_truck.png');
      this.infowindow.open(this.map, this);
    },

    update_location : function(model) {
      var location_id = model.get("location_id");
      var that = this;
      model.fetch( { success: function() {
          var newPosition = new google.maps.LatLng(
            parseFloat(model.get('latitude')),
            parseFloat(model.get('longitude')));

          that.marker.animateTo(newPosition, {  easing: "swing",
                                           duration: 3000,
                                           complete: function() {}
                                        });
      }});
    },

    render: function() { },

    remove : function() {
      clearInterval(this.refresh_interval);
      this.marker.setMap(null);
      this.marker = null;
    }
});
