AutoForm.addInputType("basic-select", {
  template: "afBasicSelect",
  valueOut: function () {
    return this.val();
  },
  valueConverters: {
    "stringArray": function (val) {
      if (typeof val === "string") {
        val = val.split(",");
        return _.map(val, function (item) {
          return $.trim(item);
        });
      }
      return val;
    },
    "number": AutoForm.Utility.stringToNumber,
    "numberArray": function (val) {
      if (typeof val === "string") {
        val = val.split(",");
        return _.map(val, function (item) {
          item = $.trim(item);
          return AutoForm.Utility.stringToNumber(item);
        });
      }
      return val;
    },
    "boolean": AutoForm.Utility.stringToBool,
    "booleanArray": function (val) {
      if (typeof val === "string") {
        val = val.split(",");
        return _.map(val, function (item) {
          item = $.trim(item);
          return AutoForm.Utility.stringToBool(item);
        });
      }
      return val;
    },
    "date": AutoForm.Utility.stringToDate,
    "dateArray": function (val) {
      if (typeof val === "string") {
        val = val.split(",");
        return _.map(val, function (item) {
          item = $.trim(item);
          return AutoForm.Utility.stringToDate(item);
        });
      }
      return val;
    }
  },
  contextAdjust: function (context) {
    // can fix issues with some browsers selecting the firstOption instead of the selected option
    context.atts.autocomplete = "off";

    // delete eventual option used in other templates
    delete context.atts.firstOption;

    var itemAtts = _.omit(context.atts, "placeholder");
    // console.log(itemAtts);

    // build items list
    context.items = [];
    // Add all defined options
    _.each(context.selectOptions, function(item) {
      if (item.itemGroup) {
        var subItems = _.map(item.items, function(subItem) {
          return {
            name: context.name,
            label: subItem.label,
            icon: subItem.icon || false,
            image: subItem.image || false,
            value: subItem.value,
            htmlAtts: _.extend({ class: "item" }, _.omit(subItem, "label", "value", "icon", "image")),
            // _id must be included because it is a special property that
            // #each uses to track unique list items when adding and removing them
            // See https://github.com/meteor/meteor/issues/2174
            //
            // The toString() is necessary because otherwise Spacebars evaluates
            // any string to 1 if the other values are numbers, and then considers
            // that a duplicate.
            // See https://github.com/aldeed/meteor-autoform/issues/656
            _id: subItem.value.toString(),
            selected: (subItem.value === context.value),
            atts: itemAtts
          };
        });
        context.items.push({
          itemGroup: item.itemGroup,
          items: subItems
        });
      } else {
        context.items.push({
          name: context.name,
          label: item.label,
          icon: item.icon || false,
          image: item.image || false,
          value: item.value,
          htmlAtts: _.extend({ class: "item" }, _.omit(item, "label", "value", "icon", "image")),
          // _id must be included because it is a special property that
          // #each uses to track unique list items when adding and removing them
          // See https://github.com/meteor/meteor/issues/2174
          //
          // The toString() is necessary because otherwise Spacebars evaluates
          // any string to 1 if the other values are numbers, and then considers
          // that a duplicate.
          // See https://github.com/aldeed/meteor-autoform/issues/656
          _id: item.value.toString(),
          selected: (item.value === context.value),
          atts: itemAtts
        });


      }
    });
    return context;
  }
});

Template.afBasicSelect_semanticUI.helpers({
  divAtts: function() {
    var atts = { class: "ui fluid selection dropdown" };

    if (this.atts.search || this.atts.fullTextSearch) {
      // Add search class
      atts = AutoForm.Utility.addClass(atts, "search");
    }

    // if(this.options.specialClass)
    // {
    //  atts = AutoForm.Utility.addClass(atts, this.options.specialClass);
    // }

    return atts;
  },
  placeholder: function() {
    return this.atts.placeholder || "(Select One)";
  },
  label: function() {
    var value       = this.value;
    var currentItem = _.find(this.items, function(item) {
      return item.value === value;
    });

    return currentItem.label;
  },
  icons: function(){
    var value       = this.value;
    var currentItem = _.find(this.items, function(item) {
      return item.value === value;
    });

    return currentItem.icon;
  },
  image: function(){
    var value       = this.value;
    var currentItem = _.find(this.items, function(item) {
      return item.value === value;
    });

    return currentItem.image;
  },
  itemHtmlAtts: function() {
    // console.log(this.htmlAtts);
    var atts = this.htmlAtts;

    if (this.selected) {
      // Add selected class
      atts = AutoForm.Utility.addClass(atts, "active selected");
    }

    return atts;
  }
});

Template.afBasicSelect_semanticUI.events({
  "click .ui.clear.button": function(event) {
    $(event.target).closest(".ui.dropdown").dropdown("clear");
  }
});

Template.afBasicSelect_semanticUI.onRendered(function() {
  // console.log($(this.firstNode));
  $(this.firstNode).dropdown();
});
