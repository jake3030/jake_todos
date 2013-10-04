class ApplicationController < ActionController::Base
  protect_from_forgery


  def render_errors(obj)
    respond_to do |format|
      format.json { render :json => {:error => obj.respond_to?(:errors) ? obj.errors.full_messages : obj.to_s}, :status => 500 }
    end
  end
end
