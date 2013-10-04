class TodosController < ApplicationController
  before_filter :authenticate_user!, :except => :has_api_key?
  before_filter :authenticate_token, :only => :has_api_key?

  def index
    @todos = current_user.todos
    respond_to do |wants|
      wants.json { render(:json => @todos) }
      wants.html
    end
  end

  def show
    @todo = current_user.todos.find(params[:id])
    respond_to do |wants|
      wants.json { render(:json => @todo) }
      wants.html
    end
  end

  def create
    @todo = current_user.todos.build(todo_params)
    if @todo.save
      respond_to do |wants|
        wants.json { render(:json => @todo) }
        wants.html
      end
    else
      render_errors(@todo)
    end
  end

  def update
    @todo = current_user.todos.find(params[:id])
    if @todo.update_attributes(todo_params)
      respond_to do |wants|
        wants.json { render(:json => @todo) }
        wants.html
      end
    else
      render_errors(@todo)
    end
  end

  def destroy
    @todo = current_user.todos.find(params[:id]).destroy
    respond_to do |wants|
      wants.json { render(:json => @todo) }
      wants.html
    end
  end


  private
  def has_api_key?
    !params[:api_key].blank?
  end

  def authenticate_token
    current_user = User.find_by_api_key(params[:api_key])
  end

  def todo_params
    params.require(:todo).permit(:title, :order, :finished_at, :due_on)
  end
end
