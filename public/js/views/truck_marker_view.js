
/**
 * Truck Marker View
 */

var TruckMarkerView = Backbone.View.extend({

    tagName:  "li",

    initialize: function(options) {

      var self = this;

      self.model = options.model;
      self.model.on('remove', self.remove, self);

      self.map = options.map;

      var latitude = parseFloat(self.model.get('latitude'));
      var longitude = parseFloat(self.model.get('longitude'));

      self.marker = new google.maps.Marker({
          map: self.map,
          position: new google.maps.LatLng(latitude, longitude),
          animation: google.maps.Animation.DROP,
          icon : 'images/food_truck.png',
          title: self.model.get("applicant"),
          id : self.model.get('location_id')
      });
      
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

      self.marker.infowindow = new google.maps.InfoWindow({
        content: truck_info
      });

      google.maps.event.addListener(self.marker, 'mouseover', self.show_truck_info);
      google.maps.event.addListener(self.marker, 'mouseout', self.hide_truck_info);
    },

    hide_truck_info : function() {
      this.setIcon('images/food_truck.png');
      this.infowindow.close();
    },

    show_truck_info : function() {
      this.setIcon('images/food_truck.png');
      this.infowindow.open(this.map, this);
    },

    render: function() { },

    remove : function() {
      this.marker.setMap(null);
      this.marker = null;
    }
});
