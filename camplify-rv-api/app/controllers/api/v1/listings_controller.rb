module Api
  module V1
    class ListingsController < ApplicationController
      before_action :authenticate_user!, only: [:create, :update, :destroy]
      before_action :set_listing, only: [:show, :update, :destroy]
      before_action :authorize_owner!, only: [:update, :destroy]

      def index
        listings = RvListing.includes(:owner).all
        render json: listings.map { |l| listing_json(l) }
      end

      def show
        render json: listing_json(@listing)
      end

      def create
        listing = current_user.rv_listings.create!(listing_params)
        render json: listing_json(listing), status: :created
      end

      def update
        @listing.update!(listing_params)
        render json: listing_json(@listing)
      end

      def destroy
        @listing.destroy!
        head :no_content
      end

      private

      def set_listing
        @listing = RvListing.includes(:owner).find(params[:id])
      end

      def authorize_owner!
        render json: { error: "Forbidden" }, status: :forbidden unless @listing.owner_id == current_user.id
      end

      def listing_params
        params.permit(:title, :description, :location, :price_per_day)
      end

      def listing_json(listing)
        {
          id: listing.id,
          title: listing.title,
          description: listing.description,
          location: listing.location,
          price_per_day: listing.price_per_day.to_s,
          owner: { id: listing.owner.id, name: listing.owner.name },
          created_at: listing.created_at
        }
      end
    end
  end
end
