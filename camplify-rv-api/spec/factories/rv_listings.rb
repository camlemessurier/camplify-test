FactoryBot.define do
  factory :rv_listing do
    sequence(:title) { |n| "RV Listing #{n}" }
    description { "A great RV for your adventure." }
    location { "Sydney, NSW" }
    price_per_day { 150.00 }
    association :owner, factory: :user
  end
end
