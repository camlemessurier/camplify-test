require 'rails_helper'

RSpec.describe Booking, type: :model do
  it { is_expected.to belong_to(:hirer).class_name('User').with_foreign_key(:user_id) }
  it { is_expected.to belong_to(:rv_listing) }

  it { is_expected.to validate_presence_of(:start_date) }
  it { is_expected.to validate_presence_of(:end_date) }
  it { is_expected.to validate_inclusion_of(:status).in_array(Booking::STATUSES) }

  describe "end_date after start_date" do
    it "is invalid when end_date is before start_date" do
      booking = build(:booking, start_date: Date.today + 10, end_date: Date.today + 5)
      expect(booking).not_to be_valid
      expect(booking.errors[:end_date]).to include("must be after start date")
    end

    it "is invalid when end_date equals start_date" do
      date = Date.today + 5
      booking = build(:booking, start_date: date, end_date: date)
      expect(booking).not_to be_valid
    end

    it "is valid when end_date is after start_date" do
      booking = create(:booking, start_date: Date.today + 1, end_date: Date.today + 5)
      expect(booking).to be_valid
    end
  end

  describe "hirer cannot be the listing owner" do
    it "is invalid when hirer is the listing owner" do
      owner = create(:user)
      listing = create(:rv_listing, owner: owner)
      booking = build(:booking, hirer: owner, rv_listing: listing)
      expect(booking).not_to be_valid
      expect(booking.errors[:base]).to include("You cannot book your own listing")
    end

    it "is valid when hirer is a different user" do
      owner = create(:user)
      hirer = create(:user)
      listing = create(:rv_listing, owner: owner)
      booking = build(:booking, hirer: hirer, rv_listing: listing)
      expect(booking).to be_valid
    end
  end
end
