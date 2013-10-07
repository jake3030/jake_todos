class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :configure_permitted_parameters, if: :devise_controller?


  def render_errors(obj)
    respond_to do |format|
      format.json { render :json => {:error => obj.respond_to?(:errors) ? obj.errors.full_messages : obj.to_s}, :status => 500 }
    end
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) << [:first_name, :last_name]
  end

end
