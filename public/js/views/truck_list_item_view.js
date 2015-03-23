
/**
 * Truck List Item View
 */

var TruckListItemView = Backbone.View.extend({

  tagName: "li",

  initialize: function(options) {
    this.marker_view = options.marker_view;
    this.model.on('remove', this.remove, this);
    this.render();
  },


  events: {
    'mouseover div': 'show_truck_info_window',
    'mouseout div': 'hide_truck_info_window'
  },

  show_truck_info_window : function() {
    this.marker_view.show_truck_info.call(this.marker_view.marker);
  },

  hide_truck_info_window : function() {
    this.marker_view.hide_truck_info.call(this.marker_view.marker);
  },

  render: function() {
    var tmpl = _.template($('#truck-item-template').html());
    var img_src = 'images/icon-truck.png';
    if (this.model.get("facility_type") == "Push Cart" )
    {
      img_src = 'images/cart-icon.png';
    }

    this.$el.html(tmpl({
      applicant: this.model.get("applicant"),
      facility_type: this.model.get("facility_type"),
      address: this.model.get("address"),
      image_src: img_src
    }));

    return this;
  },

  remove: function() {
    this.$el.html('');
  }
});