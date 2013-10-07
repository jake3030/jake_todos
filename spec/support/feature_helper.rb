module FeatureHelper
  def go_home
    go "/"
    current_path.should == new_user_session_path
  end

  def go_home_and_login
    go "/"
    within("#new_user") do
      fill '#user_email', :with => @user.email
      fill '#user_password', :with => "pass1234"
    end
    find( 'input.button').click
    expect(page).to have_content 'Todos'
  end

  def go_to_signup_page
    expect(page).to have_css('a#sign_up_link')
    find( 'a#sign_up_link').click
    expect(page).to have_selector('input#user_first_name')
    expect(page).to have_selector('input#user_email')
  end


  def create_new_task(msg, due_on = nil)
    fill "#new-todo", :with => msg
    find("#new-todo").native.send_keys(:return)
    expect(page.html).to have_selector '#todo_list li'
    find("#todo_list li:last-child").should have_text(msg)
    set_due_on(due_on) unless due_on.blank?
  end

  def set_due_on(due_on)
    within "#todo_list li:last-child" do
      find(".view").hover
      find(".due_on").click
      expect(page).not_to have_selector '.due_on_text'
      # debugger
      page.execute_script "$(\".datepicker_table tr td:contains('#{due_on.day}')\").click()"
      sleep 0.25
      find(".datepicker_timelist div:nth-of-type(6)").click
      find(".due_on_text").should be_visible
      find(".due_on_text").text.should match(/due.*?/)
    end

  end


  def go(page)
    visit page
  end

  def fill(locator, opts = {})
    find(locator).set(opts[:with])
  end
end