# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :todo do
    sequence(:title) { Faker::Lorem.sentence }
    user
    sequence(:order) { |n| n  }
  end
end
