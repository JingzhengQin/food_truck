
/**
 * Truck List View
 */

var TruckListView = Backbone.View.extend({

    el:  $("#trucks_holder"),

    initialize: function(options) {
      this.map = options.map;
      this.list_container = $('#truck_list_items');
      this.render();
    },

    requery_trucks_near: function(lat, lgn, dist) {
      var that = this;
      this.model.remove_all();
      this.model.latitude = lat;
      this.model.longitude = lgn;
      this.model.maxDistance = dist;
      this.model.fetch( { success: function() {
          that.render();
      }});
    },

    add_truck_to_view : function(truck){
      var marker_view = new TruckMarkerView({ model: truck, map: this.map });
      var item_view = new TruckListItemView({ model: truck, marker_view : marker_view });
      $(this.list_container).append(item_view.render().el);
    },

    render: function() {
      $(this.list_container).html("");
      this.model.each(this.add_truck_to_view, this);
    }
});