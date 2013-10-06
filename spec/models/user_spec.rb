require 'spec_helper'

describe User do
  describe "validations" do
    context "valid" do
      before(:each) do
        @user = FactoryGirl.create(:user)
      end

      it "should be valid" do
        @user.should be_valid
      end
    end
  end
end
