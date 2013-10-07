TodoToptal.Views.TodoAppView = Backbone.View.extend({

  el: $("#todo_app"),

  stats_template: null,

  events: {
    "keypress #new-todo"    : "create_on_enter",
    "click #clear_completed": "clear_completed",
    "sortstop #todo_list"   : "reposition",
    "click #toggle-all"     : "toggle_all_complete",
    "change input[name='sort']"     : "sort"
  },

  initialize: function() {
    this.input = this.$("#new-todo");
    this.all_checkbox = this.$("#toggle-all")[0];
    this.mark_all_label = this.$("label[for='toggle-all']");

    this.listenTo(TodoToptal.Todos, 'add', this.add_one);
    this.listenTo(TodoToptal.Todos, 'reset', this.add_all);
    this.listenTo(TodoToptal.Todos, 'all', this.render);
    this.listenTo(TodoToptal.Todos, 'sort', this.refresh);

    this.footer = this.$('footer');
    this.main = $('#main');
    this.stats_template = _.template(tpl.get('stats-template'))
    this.info_template = _.template(tpl.get('info-template'))
    // Todos.fetch({reset: true});
  },

  render: function() {
    var finished = TodoToptal.Todos.finished().length;
    var remaining = TodoToptal.Todos.remaining().length;
    if (this.$el.find("#profile_container").length == 0) {
      this.$el.append(this.info_template({current_user: Globals.current_user}))
    };

    if (TodoToptal.Todos.length) {
      this.main.show();
      this.footer.show();
      this.footer.html(this.stats_template({finished: finished, remaining: remaining}));
    } else {
      this.main.hide();
      this.footer.hide();
    }

    this.all_checkbox.checked = !remaining;
    if (this.all_checkbox) {
      this.toggle_mark_all_label()
    }
    $( "#todo_list" ).sortable({ handle: ".order" });
    $( "#todo_list" ).disableSelection();
  },

  refresh: function() {
    this.$("#todo_list").html("");
    this.add_all()
  },

  add_one: function(todo) {
    var view = new TodoToptal.Views.TodoItemView({model: todo});
    this.$("#todo_list").append(view.render().el);
  },

  add_all: function() {
    TodoToptal.Todos.each(this.add_one, this);
  },

  create_on_enter: function(e) {
    if (e.keyCode != 13) return;
    if (!this.input.val()) return;

    TodoToptal.Todos.create({title: this.input.val()});
    this.input.val('');
  },


  reposition: function(e, ui) {
    $(e.currentTarget).find("li").each(function(index, elem) {
      TodoToptal.Todos.find_by_id($(elem).find("div").data("id")).save({order: index }, {patch:true})
    })
  },

  clear_completed: function() {
    _.invoke(TodoToptal.Todos.finished(), 'destroy');
    return false;
  },

  toggle_all_complete: function () {
    var finished = this.all_checkbox.checked;
    TodoToptal.Todos.each(function (todo) { finished ? todo.set_as_finished() : todo.set_as_unfinished() });

    this.toggle_mark_all_label()
  },

  toggle_mark_all_label: function () {
    this.mark_all_label.text("Mark all as " + (this.all_checkbox.checked ? "incomplete" : "complete"));
  },

  sort: function (e, opt) {
    console.log(arguments)
    key = $(opt).data("value")
    console.log("key", key)
    if (key == -1) { return false };
    TodoToptal.Todos.comparator = function( model ) {
      return key == "due_on" ? new Date(model.get(key)) : model.get( key )
    }
    TodoToptal.Todos.sort()
  }

});
