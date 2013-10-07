require 'spec_helper'

describe User do
  describe "validations" do
    context "valid" do
      it "should be valid" do
        @user = FactoryGirl.create(:user)
        @user.should be_valid
      end
    end

    context "invalid" do
      it "should not be valid if there is no first_name" do
        @user = FactoryGirl.build(:user, :first_name => nil)
        @user.should_not be_valid
        user_error_message.should match(/first name/i)
      end

      it "should not be valid if there is no last_name" do
        @user = FactoryGirl.build(:user, :last_name => nil)
        @user.should_not be_valid
        user_error_message.should match(/last name/i)
      end

      it "should not be valid if there is no email" do
        @user = FactoryGirl.build(:user, :email => nil)
        @user.should_not be_valid
        user_error_message.should match(/email/i)
      end


      it "should not be valid if there is no password_confirmation" do
        @user = FactoryGirl.build(:user, :password_confirmation => "")
        @user.should_not be_valid
        user_error_message.should match(/password confirmation/i)
      end

      it "should not be valid if password isnt long enough" do
        @user = FactoryGirl.build(:user, :password => "123", :password_confirmation => "123")
        @user.should_not be_valid
        user_error_message.should match(/password is too short/i)
      end


    end
  end
end
