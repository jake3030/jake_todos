require 'spec_helper'

describe TodosController do
  describe "api" do
    before(:each) do
      @user = FactoryGirl.create(:user)
    end

    context "valid CRUD operations" do
      describe "GET index" do
        before(:each) do
          @todo = FactoryGirl.create(:todo, :user_id => @user.id)
          get :index, :api_key => @user.api_key, :format => "json"
        end

        it "should be successful" do
          expect(response.status).to eq(200)
        end

        it "assigns @todos" do
          expect(assigns(:todos)).to eq([@todo])
        end

        it "renders json" do
          response.body.should == @user.todos.to_json
        end

      end

      describe "GET show" do
        before(:each) do
          @todo = FactoryGirl.create(:todo, :user_id => @user.id)
          get :show, :id => @todo.id,  :api_key => @user.api_key, :format => "json"
        end

        it "should be successful" do
          expect(response.status).to eq(200)
        end

        it "assigns @todos" do
          expect(assigns(:todo)).to eq(@todo)
        end

        it "renders json" do
          response.body.should == @todo.reload.to_json
        end

      end

      describe "POST create" do
        before(:each) do
          @todo = FactoryGirl.create(:todo, :user_id => @user.id)
          @todo_attrs = FactoryGirl.attributes_for(:todo)
          post :create, {:api_key => @user.api_key, :format => "json"}.merge(:todo => @todo_attrs)
        end

        it "should be successful" do
          expect(response.status).to eq(200)
        end

        it "assigns @todo" do
          expect(assigns(:todo).title).to eq(@todo_attrs[:title])
        end

        it "renders json" do
          response.body.should == assigns(:todo).to_json
        end

      end

      describe "PUT update" do
        before(:each) do
          @todo = FactoryGirl.create(:todo, :user_id => @user.id)
          put :update, {:id => @todo.id, :api_key => @user.api_key, :format => "json"}.merge(:todo => { :title => "old title was boring.  this one is better" })
        end

        it "should be successful" do
          expect(response.status).to eq(200)
        end

        it "assigns @todo" do
          expect(assigns(:todo).title).to eq("old title was boring.  this one is better")
        end

        it "renders json" do
          response.body.should == assigns(:todo).to_json
        end

      end

      describe "DELETE destroy" do
        before(:each) do
          @todo = FactoryGirl.create(:todo, :user_id => @user.id)
          delete :destroy, {:id => @todo.id, :api_key => @user.api_key, :format => "json"}
        end

        it "should be successful" do
          expect(response.status).to eq(200)
        end

        it "assigns @todo" do
          expect(assigns(:todo).title).to eq(@todo.title)
        end

        it "renders json" do
          response.body.should == assigns(:todo).to_json
        end

        it "deletes todo" do
          @user.todos.find_by_id(@todo.id).should be_blank
        end
      end

    end

    context "invalid attributes and operations" do
      describe "bad api key" do
        before(:each) do
          @todo = FactoryGirl.create(:todo, :user_id => @user.id)
          get :index, :api_key => "1234", :format => "json"
        end

        it "should be unsuccessful" do
          expect(response.status).to eq(500)
        end

        it "renders json errors" do
          parsed_body.should == {"error" => "User not found"}
        end
      end

      describe "bad attributes to create" do
        before(:each) do
          @todo = FactoryGirl.create(:todo, :user_id => @user.id)
          @todo_attrs = FactoryGirl.attributes_for(:todo, :title => "")
          post :create, {:api_key => @user.api_key, :format => "json"}.merge(:todo => @todo_attrs)
        end

        it "should be not successful" do
          expect(response.status).to eq(500)
        end

        it "renders json errors" do
          parsed_body.should == {"error" => ["Title can't be blank"]}
        end

      end

      describe "bad id to show" do
        before(:each) do
          @todo = FactoryGirl.create(:todo, :user_id => @user.id)
          get :show, {:api_key => @user.api_key, :format => "json", :id => 222}
        end

        it "should be not successful" do
          expect(response.status).to eq(500)
        end

        it "renders json errors" do
          parsed_body.should == {"error" => "Task not found"}
        end

      end

      describe "bad id to update" do
        before(:each) do
          @todo = FactoryGirl.create(:todo, :user_id => @user.id)
          put :update, {:api_key => @user.api_key, :format => "json", :id => 222}.merge(:todo => { :title => "something" })
        end

        it "should be not successful" do
          expect(response.status).to eq(500)
        end

        it "renders json errors" do
          parsed_body.should == {"error" => "Task not found"}
        end

      end
    end
  end
end
