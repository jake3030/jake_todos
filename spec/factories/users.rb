# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :user do
    sequence(:email) { Faker::Internet.email(Faker::Internet.user_name) }
    sequence(:first_name) { |n| Faker::Name.first_name }
    sequence(:last_name) { |n| Faker::Name.last_name }
    password "helloworld"
    password_confirmation "helloworld"
  end
end
