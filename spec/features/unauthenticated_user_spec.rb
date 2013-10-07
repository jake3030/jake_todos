require "spec_helper"

feature "an unautheticated user", %q{
  As an unautheticated user
  I want to signup for this awesome Todo service
} do


  scenario "goes to home page" do
    go_home
    expect(page).to have_selector('form')
  end

  scenario "signs up" do
    go_home
    go_to_signup_page

    within("#new_user") do
      fill '#user_first_name', :with => "Johnny"
      fill '#user_last_name', :with => "Coolguy"
      fill '#user_email', :with => "test@test.com"
      fill '#user_password', :with => "test1234"
      fill '#user_password_confirmation', :with => "test1234"
    end
    find( 'input.button').click
    expect(page).to have_content 'Welcome!'
  end

  scenario "signs up with bad info" do
    go_home
    go_to_signup_page

    within("#new_user") do
      fill '#user_first_name', :with => ""
      fill '#user_last_name', :with => "Coolguy"
      fill '#user_email', :with => "test@test.com"
      fill '#user_password', :with => "test1234"
      fill '#user_password_confirmation', :with => "test1234"
    end
    find( 'input.button').click
    expect(page).to have_content "1 error prohibited"
    expect(page).to have_content 'First name can\'t be blank'
  end


  scenario "signs up without matching pass confirmation" do
    go_home
    go_to_signup_page

    within("#new_user") do
      fill '#user_first_name', :with => "Johnny"
      fill '#user_last_name', :with => "Coolguy"
      fill '#user_email', :with => "test@test.com"
      fill '#user_password', :with => "test1234"
      fill '#user_password_confirmation', :with => "test12"
    end
    find( 'input.button').click
    expect(page).to have_content "1 error prohibited"
    expect(page).to have_content 'Password confirmation doesn\'t match'
  end


  scenario "signs up with short pass" do
    go_home
    go_to_signup_page

    within("#new_user") do
      fill '#user_first_name', :with => "Johnny"
      fill '#user_last_name', :with => "Coolguy"
      fill '#user_email', :with => "test@test.com"
      fill '#user_password', :with => "test12"
      fill '#user_password_confirmation', :with => "test12"
    end
    find( 'input.button').click
    expect(page).to have_content "1 error prohibited"
    expect(page).to have_content 'Password is too short'
  end

end


