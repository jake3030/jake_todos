class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :configure_permitted_parameters, if: :devise_controller?
  rescue_from Exception, with: :render_errors

  def render_errors(obj)
    respond_to do |format|
      format.json { render :json => {:error => obj.respond_to?(:errors) ? obj.errors.full_messages : obj.to_s}, :status => 500 }
    end
  end


  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) << [:first_name, :last_name]
  end


  def has_api_key?
    !params[:api_key].blank?
  end

  def authenticate_token
    @current_user = User.find_by_api_key(params[:api_key])
    raise "User not found" if @current_user.blank?
  end

end
