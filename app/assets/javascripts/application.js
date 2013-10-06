// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//= require jquery_ujs
//= require lib/jquery-ui
//= require lib/underscore
//= require lib/backbone
//= require lib/moment
//= require lib/utils
//= require lib/jquery.simple-dtpicker
// require backbone_rails_sync
// require backbone_datalink
//= require backbone/todo_toptal
//= require_tree ./backbone


// Loading templates
var App, Globals

Globals = {
  current_user: null
}


$(document).ready(function() {
  tpl.load_all_templates(function () {
    App = new TodoToptal.Views.TodoAppView;
    $(document).trigger("todo_app:app_loaded")
  })
});


