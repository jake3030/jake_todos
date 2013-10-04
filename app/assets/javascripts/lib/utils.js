tpl = {

  // Hash of preloaded templates for the app
  templates:{},

  load_all_templates: function(callback) {
    tpl.load_templates(['todo-template', 'stats-template', "info-template"], callback)
  },
  load_templates:function (names, callback) {
    $.ajaxSetup({ cache: false });
    var that = this;

    var load_template = function (index) {
      var name = names[index];
      $.get('/assets/tpl/' + name + '.html', function (data) {
        that.templates[name] = data;
        index++;
        if (index < names.length) {
          load_template(index);
        } else {
          callback();
        }
      }, "html");
    }

    load_template(0);
  },

  // Get template by name from hash of preloaded templates
  get:function (name) {
    return this.templates[name];
  }

};