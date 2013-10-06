describe('TodoItemView', function() {
  var todo_view;

  beforeEach(function() {
    $.ajaxSetup({ cache: false, async: false });
    $('body').append('<ul id="todo_list"></ul>');
    tpl.load_all_templates(function () {
      todo_view = new TodoToptal.Views.TodoItemView({ model: new TodoToptal.Models.Todo(_.clone(TodoTestResponse[2])) });
      $('#todo_list').append(todo_view.render().el);
    })

  });

  afterEach(function() {
    todo_view.remove();
    $('#todo_list').remove();
  });

  it('should be tied to an LI tag', function() {
    expect(todo_view.el.tagName.toLowerCase()).toBe('li');
  });

  it('should have a Todo instance.', function() {
    expect(todo_view.model).toBeDefined();
    expect(todo_view.model.get('title')).toBe("Fun Task");
  });

  it('should render properly and be visible', function() {
    var output = todo_view.render();
    expect(output.$el.length).toBe(1);
  });

  describe('events for view -- ', function() {
    var $element
    var $list

    beforeEach(function() {
      $element = todo_view.render().el;
      $list = $('#todo_list');

      $list.append($element);
      $element = $list.find('li .toggle');
      expect(todo_view.model.get('finished_at')).toBe(null);
      expect($element.length).toBeGreaterThan(0);
    })

    describe('checking main checkbox', function() {
      it('should set finished_at for it\'s model when checked', function() {
        spyOn($, 'ajax').andCallFake(function(options) {
          options.success(_.clone(TodoTestResponse[1]));
        });
        runs(function() {
          $element.click();
          expect(todo_view.model.get('finished_at')).not.toBe(undefined);
          expect(todo_view.model.get('finished_at')).not.toBe(null);
        });
      });

      it('should unset finished_at for it\'s model when unchecked', function() {
        var spec_callback = function() {
          return _.extend(_.clone(todo_view.model), {finished_at: "2013-10-04T02:53:39.000Z"})
        }
        spyOn(todo_view, 'toggle_finished').andCallThrough();
        spyOn($, 'ajax').andCallFake(function(options) {
          options.success(spec_callback());
        });
        todo_view.delegateEvents();

        runs(function () {
          $element.click();
        });
        var spec_callback = function() {
          return _.extend(_.clone(todo_view.model), {finished_at: null})
        }

        waits(10);

        runs(function () {
          $element.click();
        });

        runs(function () {
          expect(todo_view.toggle_finished).toHaveBeenCalled();
          expect(todo_view.model.get('finished_at')).toBe(null);
        });

      });

    })

    describe('dblclicking on main part of view', function() {
      var $edit

      beforeEach(function() {
        expect(todo_view.model.get('title')).toEqual("Fun Task");
        spyOn(todo_view, 'edit').andCallThrough();
        $edit = $list.find(".edit")
        todo_view.delegateEvents();

        runs(function() {
          $list.find(".view").dblclick();
        });
      })

      it('should add the editing class to the container', function() {
        runs(function() {
          expect(todo_view.$el.hasClass("editing")).toBe(true);
        })
      });

      it('should show the input field filled with current todo title', function() {
        runs(function() {
          expect(todo_view.edit).toHaveBeenCalled();
          expect($edit.val()).toEqual(todo_view.model.get("title"));
        })
      });

    })


    describe('clicking on destroy button', function() {
      var $destroy

      beforeEach(function() {
        expect(todo_view.model).toBeDefined();
        spyOn(todo_view, 'clear').andCallThrough();
        $destroy = $list.find(".destroy")
        todo_view.delegateEvents();
        expect($list.find("li").length).toEqual(1);

        spyOn($, 'ajax').andCallFake(function(options) {
          options.success(null);
        });

        runs(function() {
          $destroy.click();
        });

      })

      it('should remove the view from the DOM', function() {
        runs(function() {
          expect(todo_view.clear).toHaveBeenCalled();
          expect($list.find("li").length).toEqual(0);
        })
      });

      it('should make call to rails to delete todo', function() {
        runs(function() {
          var ajaxCallParams = $.ajax.mostRecentCall.args[0];
          expect(ajaxCallParams.url).toEqual('/todos/' + todo_view.model.get("id"));
          expect(ajaxCallParams.type).toEqual('DELETE');
        })
      });

    })


    describe('due_on button', function() {
      var $due_on

      describe('visibility', function() {
        beforeEach(function() {
          expect(todo_view.model).toBeDefined();
          $due_on = $list.find(".due_on")
        })


        it('should not be visible if model already has a due date', function() {
          expect($due_on.length).toEqual(0);
        });

        it('should be visible if model does not have a due date', function() {
          todo_view.model.set("due_on", null)
          expect($list.find(".due_on").length).toEqual(1);
        });
      })

      describe('clicking', function() {
        beforeEach(function() {
          expect(todo_view.model).toBeDefined();
          todo_view.model.set("due_on", null)
          spyOn(todo_view, 'open_calendar').andCallThrough();
          $due_on = $list.find(".due_on")
          todo_view.delegateEvents();
          expect($list.find("li").length).toEqual(1);
          runs(function() {
            $due_on.click();
          });
        })

        it('should open the calendar', function() {
          runs(function() {
            expect(todo_view.open_calendar).toHaveBeenCalled();
            expect($list.find(".datepicker").length).toEqual(1);
          })
        });
      })
    })


    describe('pressing enter while editing a task', function() {
      var $edit

      beforeEach(function() {
        expect(todo_view.model).toBeDefined();
        spyOn(todo_view, 'update_on_enter').andCallThrough();
        spyOn(todo_view, 'close').andCallThrough();
        $edit = $list.find(".edit")
        $edit.val("new task")
        todo_view.delegateEvents();
        spyOn($, 'ajax').andCallFake(function(options) {
          options.success(_.extend(_.clone(TodoTestResponse[1]), {"title":  "new task"}));
        });

        runs(function() {
          $list.find(".view").dblclick();
        });

        runs(function() {
          var e = jQuery.Event( 'keypress', { which: $.ui.keyCode.ENTER, keyCode: $.ui.keyCode.ENTER  } );
          $edit.trigger(e);
        });
      })

      it('should call update_on_enter and then call close', function() {
        runs(function() {
          expect(todo_view.update_on_enter).toHaveBeenCalled();
          expect(todo_view.close).toHaveBeenCalled();
        })
      });

      it('should save new task into model', function() {
        runs(function() {
          expect(todo_view.model.get("title")).toEqual("new task");
        })
      });

      it('should remove the editing class from the container elem', function() {
        runs(function() {
          expect(todo_view.$el.hasClass("editing")).toBe(false);
        })
      });
    })


  })


});