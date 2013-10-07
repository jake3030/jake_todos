# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :todo do
    sequence(:title) { Faker::Lorem.sentence }
    user
    sequence(:order) { |n| rand(n)  }
  end

  factory :todo_with_due_date, :parent => :todo do
    sequence(:due_on) { Time.now + rand(20).days + rand(300).minutes}
  end
end
