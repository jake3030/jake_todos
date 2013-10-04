describe('Todo Model', function() {
  var MOCK_GET_DATA = {
    "id": 4,
    "title": "Tough Task",
    "due_on": "2013-10-16T01:30:00.000Z",
    "finished_at": "2013-10-04T02:53:39.000Z",
    "order": 4,
    "created_at": "2013-10-03T18:13:28.000Z",
  }


  var MOCK_POST_DATA = {
    success: true
  };


  it('should be able to create its application test objects', function() {
    var todo = new TodoToptal.Models.Todo();
    expect(todo).toBeDefined();
    expect(MOCK_GET_DATA).toBeDefined();
    expect(MOCK_POST_DATA).toBeDefined();
  });


  describe('has property getter functions that', function() {
    var todo = new TodoToptal.Models.Todo(MOCK_GET_DATA);

    it('should return the title', function() {
      expect(todo.get("title")).toEqual('Tough Task');
    });

    it('should return the order', function() {
      expect(todo.get("order")).toEqual(4);
    });

    it('should return the due_on', function() {
      expect(todo.get("due_on")).toEqual("2013-10-16T01:30:00.000Z");
    });

    it('should return the finished_at', function() {
      expect(todo.get("finished_at")).toEqual("2013-10-04T02:53:39.000Z");
    });

    it('should return the URL', function() {
      expect(todo.url()).toEqual('/todos/' + todo.id);
    });
  });


  describe('#finished', function() {
    var todo = new TodoToptal.Models.Todo(MOCK_GET_DATA);

    it('should be true if todo is finished', function() {
      expect(todo.finished()).toEqual(true);
    });

    it('should not be true if todo is not finished', function() {
      todo.set("finished_at", null)
      expect(todo.finished()).toEqual(false);
    });
  });

  describe('setting finished_at', function() {
    var todo;

    beforeEach(function() {
      todo = new TodoToptal.Models.Todo();
    });

    afterEach(function() {
      todo = undefined;
    });

    it('should set finished_at when #set_as_finished is called', function() {
      spyOn($, 'ajax').andCallFake(function(options) {
        options.success(MOCK_GET_DATA);
      });

      expect(todo.get("finished_at")).toEqual(null);
      todo.set_as_finished()
      var ajaxCallParams = $.ajax.mostRecentCall.args[0];
      expect($.parseJSON(ajaxCallParams.data).finished_at).not.toEqual(null);
      expect(todo.get("finished_at")).not.toEqual(null);
    });

    it('should set finished_at to null when #set_as_unfinished is called', function() {
      expect(todo.get("finished_at")).toEqual(null);
      todo.set("finished_at", moment())
      expect(todo.get("finished_at")).not.toEqual(null);
      spyOn($, 'ajax').andCallFake(function(options) {
        resp = _.clone(MOCK_GET_DATA)
        resp.finished_at = null
        options.success(resp);
      });
      todo.set_as_unfinished()
      var ajaxCallParams = $.ajax.mostRecentCall.args[0];
      expect($.parseJSON(ajaxCallParams.data).finished_at).toEqual(null);
      expect(todo.get("finished_at")).toEqual(null);

    });
  });


  describe('server sync testing', function() {
    var todo;


    beforeEach(function() {
      spyOn($, 'ajax').andCallFake(function(options) {
        options.success(MOCK_GET_DATA);
      });

      todo = new TodoToptal.Models.Todo();
    });

    afterEach(function() {
      todo = undefined;
    });

    it('should call through to .ajax with proper params', function() {
      todo.save({order: 2}, {patch: true})
      var ajaxCallParams = $.ajax.mostRecentCall.args[0];

      expect(ajaxCallParams.dataType).toEqual('json');
      expect($.parseJSON(ajaxCallParams.data).order).toEqual(2);
      expect(ajaxCallParams.url).toEqual('/todos');
      expect(ajaxCallParams.type).toEqual('POST');
      expect(ajaxCallParams.success).toBeDefined();
    });

    it('should be able to parse mocked service response', function() {
      todo.fetch()
      expect(_.isEmpty(todo.attributes)).toEqual(false);
      expect(todo.get('title')).toEqual('Tough Task');
      expect(todo.get('due_on')).toEqual("2013-10-16T01:30:00.000Z");
      expect(todo.get('order')).toEqual(4);
      expect(todo.get('finished_at')).toEqual("2013-10-04T02:53:39.000Z");
      expect(todo.url()).toEqual('/todos/' + todo.id);
    });
  });

});




describe('TodoList Collection', function() {
  var todos

  beforeEach(function() {
    todos = TodoToptal.Collection.Todos;
    spyOn($, 'ajax').andCallFake(function(options) {
      options.success(TodoTestResponse);
    });

    todos.fetch();
  });

  it('should be able to create its application test objects', function() {
    expect(todos).toBeDefined();
    expect(TodoTestResponse).toBeDefined();
  });

  describe('properties of Todos that', function() {


    it('should return the collection', function() {
      expect(todos.models.length).toEqual(TodoTestResponse.length);
    });

    it('should return the URL', function() {
      expect(todos.url).toEqual('/todos');
    });
  });


  describe('.find_by_id', function() {
    it('should return the object if it is found', function() {
      obj = todos.find_by_id(4)
      expect(obj).not.toEqual(null);
      expect(obj.get("title")).toEqual("Cool task");
    });

    it('should return null if no object is found', function() {
      expect(todos.find_by_id(2222)).toEqual(null);
    });
  });


  describe('.finished', function() {
    it('should return all objects that are finished', function() {
      objs = todos.finished()
      expect(objs.length).toEqual(3);
    });

    it('should not return any object that is not finished', function() {
      objs = todos.finished()
      not_finished = todos.remaining()
      _.each(not_finished, function(el, index) {
        expect(el.finished()).toEqual(false);
        expect(_.contains(objs, el)).toEqual(false);
      })

    });
  });

  describe('.remaining', function() {
    it('should return all objects that are not finished', function() {
      objs = todos.remaining()
      expect(objs.length).toEqual(3);
    });

    it('should not return any object that are finished', function() {
      objs = todos.finished()
      not_finished = todos.remaining()
      _.each(objs, function(el, index) {
        expect(el.finished()).toEqual(true);
        expect(_.contains(not_finished, el)).toEqual(false);
      })

    });
  });


  describe('.next_position', function() {
    it('should return the next highest number', function() {
      expect(todos.next_position()).toEqual(6);
    });

    it('should return 1 if there are no todos', function() {
      todos.reset([])
      expect(todos.next_position()).toEqual(1);
    });
  });

  describe('sort order', function() {
    it('should sort ascending based on order field', function() {

      expect(todos.pluck("order")).toEqual(_.pluck(TodoTestResponse, "order").sort());
    });

    it('should update collection if order changes', function() {
      expect(todos.pluck("order")).toEqual(_.pluck(TodoTestResponse, "order").sort());
      obj = todos.find_by_id(4)
      obj.set("order", 25)
      todos.sort()

      expect(todos.pluck("order")).toEqual(todos.map(function(o){ return o.get("order") }).sort(function(a, b){ return a - b}));
    });
  });
});