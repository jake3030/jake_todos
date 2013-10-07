module ModelSpecHelper
  def user_error_message
    @user.errors.full_messages.first
  end
end