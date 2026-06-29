require 'swagger_helper'

RSpec.describe 'Bookings API', type: :request do
  let(:owner) { create(:user) }
  let(:hirer) { create(:user) }
  let(:listing) { create(:rv_listing, owner: owner) }

  path '/api/v1/listings/{listing_id}/bookings' do
    parameter name: :listing_id, in: :path, type: :integer

    post 'Create a booking request' do
      tags 'Bookings'
      security [{ bearerAuth: [] }]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :body, in: :body, schema: {
        type: :object,
        properties: {
          start_date: { type: :string, format: :date },
          end_date: { type: :string, format: :date }
        },
        required: %w[start_date end_date]
      }

      response '201', 'booking created' do
        let(:listing_id) { listing.id }
        let(:Authorization) { "Bearer #{hirer.token}" }
        let(:body) { { start_date: (Date.today + 7).to_s, end_date: (Date.today + 14).to_s } }
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['status']).to eq('pending')
        end
      end

      response '422', 'cannot book own listing' do
        let(:listing_id) { listing.id }
        let(:Authorization) { "Bearer #{owner.token}" }
        let(:body) { { start_date: (Date.today + 7).to_s, end_date: (Date.today + 14).to_s } }
        run_test!
      end

      response '422', 'invalid dates' do
        let(:listing_id) { listing.id }
        let(:Authorization) { "Bearer #{hirer.token}" }
        let(:body) { { start_date: (Date.today + 14).to_s, end_date: (Date.today + 7).to_s } }
        run_test!
      end

      response '401', 'unauthorized' do
        let(:listing_id) { listing.id }
        let(:Authorization) { 'Bearer invalid' }
        let(:body) { {} }
        run_test!
      end
    end
  end

  path '/api/v1/bookings/as_hirer' do
    get 'List bookings as hirer' do
      tags 'Bookings'
      security [{ bearerAuth: [] }]
      produces 'application/json'

      response '200', 'bookings retrieved' do
        before { create(:booking, hirer: hirer, rv_listing: listing) }
        let(:Authorization) { "Bearer #{hirer.token}" }
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data).to be_an(Array)
          expect(data.first['rv_listing']).to have_key('title')
        end
      end

      response '401', 'unauthorized' do
        let(:Authorization) { 'Bearer invalid' }
        run_test!
      end
    end
  end

  path '/api/v1/bookings/as_owner' do
    get 'List bookings as owner' do
      tags 'Bookings'
      security [{ bearerAuth: [] }]
      produces 'application/json'

      response '200', 'bookings retrieved' do
        before { create(:booking, hirer: hirer, rv_listing: listing) }
        let(:Authorization) { "Bearer #{owner.token}" }
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data).to be_an(Array)
          expect(data.first['hirer']).to have_key('name')
        end
      end

      response '401', 'unauthorized' do
        let(:Authorization) { 'Bearer invalid' }
        run_test!
      end
    end
  end

  path '/api/v1/bookings/{id}/confirm' do
    parameter name: :id, in: :path, type: :integer

    patch 'Confirm a booking' do
      tags 'Bookings'
      security [{ bearerAuth: [] }]
      produces 'application/json'

      response '200', 'booking confirmed' do
        let(:booking) { create(:booking, hirer: hirer, rv_listing: listing) }
        let(:id) { booking.id }
        let(:Authorization) { "Bearer #{owner.token}" }
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['status']).to eq('confirmed')
        end
      end

      response '403', 'forbidden - not the listing owner' do
        let(:booking) { create(:booking, hirer: hirer, rv_listing: listing) }
        let(:id) { booking.id }
        let(:Authorization) { "Bearer #{hirer.token}" }
        run_test!
      end

      response '422', 'booking already processed' do
        let(:booking) { create(:booking, hirer: hirer, rv_listing: listing, status: 'confirmed') }
        let(:id) { booking.id }
        let(:Authorization) { "Bearer #{owner.token}" }
        run_test!
      end
    end
  end

  path '/api/v1/bookings/{id}/reject' do
    parameter name: :id, in: :path, type: :integer

    patch 'Reject a booking' do
      tags 'Bookings'
      security [{ bearerAuth: [] }]
      produces 'application/json'

      response '200', 'booking rejected' do
        let(:booking) { create(:booking, hirer: hirer, rv_listing: listing) }
        let(:id) { booking.id }
        let(:Authorization) { "Bearer #{owner.token}" }
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['status']).to eq('rejected')
        end
      end

      response '403', 'forbidden - not the listing owner' do
        let(:booking) { create(:booking, hirer: hirer, rv_listing: listing) }
        let(:id) { booking.id }
        let(:Authorization) { "Bearer #{hirer.token}" }
        run_test!
      end
    end
  end
end
