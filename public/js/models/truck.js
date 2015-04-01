
/**
 * Truck Model
 */

var Truck = Backbone.Model.extend({
	url: function() {
    return '/cache/truck/' + this.get("location_id"); 
    },

});