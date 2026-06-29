module Api
  module V1
    class MessagesController < ApplicationController
      before_action :authenticate_user!
      before_action :set_listing
      before_action :authorize_access!

      def index
        messages = @listing.messages.includes(:user).order(:created_at)
        render json: messages.map { |m| message_json(m) }
      end

      def create
        message = @listing.messages.create!(
          user: current_user,
          content: params[:content]
        )
        render json: message_json(message), status: :created
      end

      private

      def set_listing
        @listing = RvListing.find(params[:listing_id])
      end

      def authorize_access!
        is_owner = @listing.owner_id == current_user.id
        has_booking = @listing.bookings.exists?(user_id: current_user.id)
        render json: { error: "Forbidden" }, status: :forbidden unless is_owner || has_booking
      end

      def message_json(message)
        {
          id: message.id,
          content: message.content,
          user: { id: message.user.id, name: message.user.name },
          created_at: message.created_at
        }
      end
    end
  end
end
