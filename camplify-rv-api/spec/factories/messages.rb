FactoryBot.define do
  factory :message do
    content { "Hello, is this RV available?" }
    association :user
    association :rv_listing
  end
end
