require 'spec_helper'

describe Todo do
  describe "validation" do
    it "should be valid if title is filled out" do
      @todo = FactoryGirl.create(:todo)
      @todo.should be_valid
      @todo.user.should_not be_blank
    end

    it "should not be valid if there is no title" do
      @todo = FactoryGirl.build(:todo, :title => "")
      @todo.should_not be_valid
      @todo.errors.full_messages.first.should match(/title/i)
    end
  end
end
