require "spec_helper"

feature "an authenticated user", %q{
  As an autheticated user
  I want to use this awesome Todo service
} do


  background do
    @user = User.create(FactoryGirl.attributes_for(:user, :password => "pass1234", :password_confirmation => "pass1234"))
    Capybara.ignore_hidden_elements = false
  end

  scenario "goes to home page and logs in for the first time", :js => true do
    go_home_and_login
    expect(page).to have_content 'Todos'
    expect(page).to have_content @user.first_name
    expect(page.html).to have_selector '#todo_list'
    expect(page.html).not_to have_selector '#todo_list li'
    find("#todo_list").should_not be_visible
  end

  context "logs in", :js => true do
    before(:each) do
      go_home_and_login
    end

    scenario "adds a todo" do
      create_new_task("a new task")
    end

    scenario "adds due date to task" do
      create_new_task("a new task")
      set_due_on(Time.now + 6.days)
    end

    scenario "checks off a task" do
      create_new_task("a new task")
      find(".toggle").click
      find("#todo_list li")[:class].should == 'done'
      find(".view").hover
      find(".finished_at").should be_visible
    end

    scenario "edits a task" do
      create_new_task("a new task")
      page.driver.browser.mouse.double_click(find(".view").native)
      find(".edit").should be_visible
      find(".edit").value.should == 'a new task'
      fill ".edit", :with => "a newer task"
      find(".edit").native.send_keys(:return)
      find("#todo_list li").should have_text("a newer task")
    end

    scenario "deletes a task" do
      create_new_task("a new task")
      find(".view").hover
      find(".destroy").should be_visible
      find(".destroy").click
      expect(page.html).not_to have_selector '#todo_list li'
    end

    scenario "sorts list by due date" do
      create_new_task("a new task", Time.now + 10.days)
      create_new_task("a newer task", Time.now + 5.days)
      create_new_task("a new task 4", Time.now + 3.days)
      page.execute_script "$('.cd-dropdown > span').trigger('mousedown')"
      sleep 0.5
      find("li[data-value='due_on']").should be_visible
      find("li[data-value='due_on']").click
      titles = page.driver.find_css("#todo_list li").map {|t| t.find_css(".view label").first.visible_text}
      titles.should == ["a new task 4", "a newer task", "a new task"]
    end


    scenario "checks all as completed" do
      create_new_task("a new task", Time.now + 10.days)
      create_new_task("a newer task", Time.now + 5.days)
      create_new_task("a new task 4", Time.now + 3.days)
      find("#toggle-all").click
      klasses = page.driver.find_css("#todo_list li").map {|t| t[:class]}
      klasses.all? { |e| e == "done" }.should == true
    end


  end




end


