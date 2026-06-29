require 'rails_helper'

RSpec.describe RvListing, type: :model do
  it { is_expected.to belong_to(:owner).class_name('User') }
  it { is_expected.to have_many(:bookings).dependent(:destroy) }
  it { is_expected.to have_many(:messages).dependent(:destroy) }

  it { is_expected.to validate_presence_of(:title) }
  it { is_expected.to validate_presence_of(:description) }
  it { is_expected.to validate_presence_of(:location) }
  it { is_expected.to validate_presence_of(:price_per_day) }
  it { is_expected.to validate_numericality_of(:price_per_day).is_greater_than(0) }
end
