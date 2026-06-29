module Authenticatable
  extend ActiveSupport::Concern

  included do
    attr_reader :current_user
  end

  def authenticate_user!
    token = extract_token
    @current_user = User.find_by(token: token) if token
    render json: { error: "Unauthorized" }, status: :unauthorized unless @current_user
  end

  private

  def extract_token
    header = request.headers["Authorization"]
    header&.split(" ")&.last
  end
end
