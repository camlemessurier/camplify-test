class Booking < ApplicationRecord
  belongs_to :hirer, class_name: "User", foreign_key: :user_id
  belongs_to :rv_listing

  STATUSES = %w[pending confirmed rejected].freeze

  validates :start_date, presence: true
  validates :end_date, presence: true
  validates :status, inclusion: { in: STATUSES }
  validate :end_date_after_start_date
  validate :hirer_is_not_owner

  private

  def end_date_after_start_date
    return unless start_date && end_date
    errors.add(:end_date, "must be after start date") if end_date <= start_date
  end

  def hirer_is_not_owner
    return unless hirer && rv_listing
    errors.add(:base, "You cannot book your own listing") if user_id == rv_listing.owner_id
  end
end
