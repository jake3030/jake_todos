var TodoItemView = Backbone.View.extend({

  tagName:  "li",
  template: null,

  events: {
    "click .toggle"         : "toggle_finished",
    "dblclick .view"        : "edit",
    "click a.destroy"       : "clear",
    "click a.due_on"        : "open_calendar",
    "keypress .edit"        : "update_on_enter",
    "blur .edit"            : "close",
    "dtpicker:change .due_on_input"  : "update_due_on",
    "click .due_on_text"     : "open_calendar",

  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.template =   _.template(tpl.get('todo-template'))
  },

  render: function() {
    this.$el.html(this.template({model: this.model}));
    this.$el.toggleClass('done', this.model.finished());
    this.input = this.$('.edit');
    this.due_on_input = this.$('.due_on_input');
    this.due_on_input.appendDtpicker({
      "closeOnSelected": true,
      "calendarMouseScroll": false,
    });
    return this;
  },

  toggle_finished: function() {
    this.model.toggle();
  },

  edit: function() {
    this.$el.addClass("editing");
    this.input.focus();
  },

  close: function() {
    var value = this.input.val();
    if (!value) {
      this.clear();
    }
    else {
      this.model.save({title: value}, {patch: true});
      this.$el.removeClass("editing");
    }
  },

  update_on_enter: function(e) {
    if (e.keyCode == 13) this.close();
  },

  clear: function() {
    this.model.destroy();
  },

  update_due_on: function() {
    this.model.save({due_on: this.due_on_input.val() }, {patch: true});
  },

  open_calendar: function(e) {
    this.due_on_input.click()
  },

});
