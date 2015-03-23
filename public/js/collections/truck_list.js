
/**
 * Truck Collection
 */

var TruckList = Backbone.Collection.extend({

  model: Truck,
  url: function() {
    return '/trucks/near/' + this.latitude + '/' + this.longitude + '/' + this.maxDistance; 
  },

  initialize: function(options) {
    this.latitude = options.latitude;
    this.longitude = options.longitude;
    this.maxDistance = options.maxDistance;
  },

  add_new: function(truck) {
    this.create(truck);
  },

  // trucks are sorted by their name
  comparator: function(truck) {
    return truck.get('name');
  },

  remove_all: function() {
    var model;
    while (model = this.pop()) {
      model.destroy();
    }
  }
});