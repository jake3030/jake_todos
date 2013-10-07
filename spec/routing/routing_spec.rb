require 'spec_helper'

describe "routes for Todos" do
  context "api namespace" do
    it "routes GET /api/todos to the todos controller" do
      expect(:get => "/api/todos").to route_to(
        :controller => "todos",
        :action => "index"
      )
    end

    it "routes POST /api/todos to the todos controller" do
      expect(:post => "/api/todos").to route_to(
        :controller => "todos",
        :action => "create"
      )
    end
  end

  context "reg namespace" do
    it "routes GET /todos to the todos controller" do
      expect(:get => "/todos").to route_to(
        :controller => "todos",
        :action => "index"
      )
    end

    it "routes POST /todos to the todos controller" do
      expect(:post => "/todos").to route_to(
        :controller => "todos",
        :action => "create"
      )
    end
  end


end