TodoToptal.Models.Todo = Backbone.Model.extend({
  urlRoot: "/todos",
  defaults: function() {
    return {
      title: "next on the list...",
      order: TodoToptal.Todos.next_position(),
      finished_at: null
    };
  },

  finished: function() {
    return this.get("finished_at") != null
  },

  toggle: function() {
    this.finished() ? this.set_as_unfinished() : this.set_as_finished()
  },

  set_as_finished: function() {
    this.save({finished_at: moment()}, {patch:true});
  },

  set_as_unfinished: function() {
    this.save({finished_at: null}, {patch:true});
  },
});

TodoToptal.Collections.TodosCollection = Backbone.Collection.extend({
  model: TodoToptal.Models.Todo,
  url: "/todos",

  find_by_id: function(id) {
    return this.find(function(t){ return t.get("id").toString() == id.toString() });
  },

  finished: function() {
    return this.filter(function(t){ return t.finished() });
  },

  remaining: function() {
    return this.filter(function(t){ return !t.finished() });
  },

  next_position: function() {
    if (!this.length) return 1;
    return this.last().get('order') + 1;
  },

  comparator: function(todo) {
    return todo.get("order");
  }
});

TodoToptal.Todos = new TodoToptal.Collections.TodosCollection;
