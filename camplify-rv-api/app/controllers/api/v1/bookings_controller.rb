module Api
  module V1
    class BookingsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_booking, only: [:confirm, :reject]
      before_action :authorize_listing_owner!, only: [:confirm, :reject]

      def create
        listing = RvListing.find(params[:listing_id])

        if listing.owner_id == current_user.id
          render json: { error: "You cannot book your own listing" }, status: :unprocessable_entity
          return
        end

        booking = listing.bookings.create!(
          hirer: current_user,
          start_date: booking_params[:start_date],
          end_date: booking_params[:end_date]
        )
        render json: booking_json(booking), status: :created
      end

      def as_hirer
        bookings = current_user.bookings.includes(rv_listing: :owner)
        render json: bookings.map { |b| booking_json(b) }
      end

      def as_owner
        bookings = Booking.includes(:hirer, rv_listing: :owner)
                          .joins(:rv_listing)
                          .where(rv_listings: { owner_id: current_user.id })
        render json: bookings.map { |b| booking_json(b, include_hirer: true) }
      end

      def confirm
        transition_booking("confirmed")
      end

      def reject
        transition_booking("rejected")
      end

      private

      def set_booking
        @booking = Booking.includes(:hirer, rv_listing: :owner).find(params[:id])
      end

      def authorize_listing_owner!
        render json: { error: "Forbidden" }, status: :forbidden unless @booking.rv_listing.owner_id == current_user.id
      end

      def transition_booking(new_status)
        unless @booking.status == "pending"
          render json: { error: "Booking is already #{@booking.status}" }, status: :unprocessable_entity
          return
        end
        @booking.update!(status: new_status)
        render json: booking_json(@booking, include_hirer: true)
      end

      def booking_params
        params.permit(:start_date, :end_date)
      end

      def booking_json(booking, include_hirer: false)
        json = {
          id: booking.id,
          start_date: booking.start_date,
          end_date: booking.end_date,
          status: booking.status,
          rv_listing: {
            id: booking.rv_listing.id,
            title: booking.rv_listing.title,
            location: booking.rv_listing.location
          },
          created_at: booking.created_at
        }
        json[:hirer] = { id: booking.hirer.id, name: booking.hirer.name } if include_hirer
        json
      end
    end
  end
end
