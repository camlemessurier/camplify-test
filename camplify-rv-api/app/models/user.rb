class User < ApplicationRecord
  has_secure_password

  has_many :rv_listings, foreign_key: :owner_id, dependent: :destroy, inverse_of: :owner
  has_many :bookings, foreign_key: :user_id, dependent: :destroy
  has_many :messages, dependent: :destroy

  validates :name, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 8 }, allow_nil: true

  before_create :generate_token

  def generate_token
    self.token = SecureRandom.hex(32)
  end

  def regenerate_token!
    update!(token: SecureRandom.hex(32))
  end

  def invalidate_token!
    update!(token: nil)
  end
end
