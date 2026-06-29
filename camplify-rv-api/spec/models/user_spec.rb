require 'rails_helper'

RSpec.describe User, type: :model do
  it { is_expected.to have_many(:rv_listings).with_foreign_key(:owner_id) }
  it { is_expected.to have_many(:bookings).with_foreign_key(:user_id) }
  it { is_expected.to have_many(:messages) }

  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_presence_of(:email) }
  it "validates uniqueness of email" do
    create(:user, email: "taken@example.com")
    duplicate = build(:user, email: "taken@example.com")
    expect(duplicate).not_to be_valid
    expect(duplicate.errors[:email]).to be_present
  end
  it { is_expected.to have_secure_password }

  it "generates a token before create" do
    user = build(:user)
    expect(user.token).to be_nil
    user.save!
    expect(user.token).to be_present
  end

  it "validates email format" do
    user = build(:user, email: "not-an-email")
    expect(user).not_to be_valid
    expect(user.errors[:email]).to be_present
  end

  it "validates password minimum length" do
    user = build(:user, password: "short")
    expect(user).not_to be_valid
    expect(user.errors[:password]).to be_present
  end
end
