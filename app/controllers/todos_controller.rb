class TodosController < ApplicationController
  before_filter :authenticate_user!, :unless => :has_api_key?
  before_filter :authenticate_token, :if => :has_api_key?

  def index
    @todos = current_user.todos.order("todos.#{todo_sort} ASC")
    respond_to do |wants|
      wants.json { render(:json => @todos) }
      wants.html
    end
  end

  def show
    @todo = current_user.todos.find_by_id(params[:id])
    raise "Task not found" if @todo.blank?
    respond_to do |wants|
      wants.json { render(:json => @todo) }
      wants.html
    end
  end

  def create
    @todo = current_user.todos.build(todo_params)
    if @todo.save
      respond_to do |wants|
        wants.json { render(:json => @todo.reload) }
        wants.html
      end
    else
      render_errors(@todo)
    end
  end

  def update
    @todo = current_user.todos.find_by_id(params[:id])
    raise "Task not found" if @todo.blank?
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

  def mark_all_as_complete
    mark_as(:complete)
  end

  def mark_all_as_incomplete
    mark_as(:incomplete)
  end


  private

  def mark_as(finish_status)
    @todos = current_user.todos
    @todos.update_all(:finished_at => finish_status == :complete ? Time.now : nil)
    respond_to do |wants|
      wants.json { render(:json => @todos) }
      wants.html
    end
  end

  def todo_sort
    @sort = params.delete(:sort)
    %w(order due_on).include?(@sort) ? @sort : "order"
  end


  def todo_params
    params.require(:todo).permit(:title, :order, :finished_at, :due_on)
  end
end
