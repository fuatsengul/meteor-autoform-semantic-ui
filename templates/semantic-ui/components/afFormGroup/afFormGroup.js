Template.afFormGroup_semanticUI.helpers({
  skipLabel: function bsFormGroupSkipLabel() {
    var self = this;
    var type = AutoForm.getInputType(self.afFieldInputAtts);

    return (self.skipLabel || type === "boolean-checkbox");
  },
  required: function bsFormGroupRequired() {
    if (this.required) {
      return "required";
    }
  },
  icon: function(){
    return this.afFieldInputAtts.icon;
  },
  iconDirection: function(){
    return this.afFieldInputAtts.iconDirection;
  },
  errorsInLabel: function() {
    return AutoForm.findAttribute("errorsInLabels") || this.afFieldInputAtts.errorsInLabel;
  }
});
