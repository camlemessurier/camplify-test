require 'swagger_helper'

RSpec.describe 'Listings API', type: :request do
  let(:owner) { create(:user) }
  let(:other_user) { create(:user) }
  let(:listing) { create(:rv_listing, owner: owner) }

  path '/api/v1/listings' do
    get 'List all listings' do
      tags 'Listings'
      produces 'application/json'

      response '200', 'listings retrieved' do
        before { create_list(:rv_listing, 3) }
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data).to be_an(Array)
          expect(data.first).to have_key('owner')
        end
      end
    end

    post 'Create a listing' do
      tags 'Listings'
      security [{ bearerAuth: [] }]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :body, in: :body, schema: {
        type: :object,
        properties: {
          title: { type: :string },
          description: { type: :string },
          location: { type: :string },
          price_per_day: { type: :number }
        },
        required: %w[title description location price_per_day]
      }

      response '201', 'listing created' do
        let(:Authorization) { "Bearer #{owner.token}" }
        let(:body) { { title: 'Beach Camper', description: 'Great van', location: 'Gold Coast', price_per_day: 100 } }
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['title']).to eq('Beach Camper')
          expect(data['owner']['id']).to eq(owner.id)
        end
      end

      response '401', 'unauthorized' do
        let(:Authorization) { 'Bearer invalid' }
        let(:body) { {} }
        run_test!
      end

      response '422', 'invalid parameters' do
        let(:Authorization) { "Bearer #{owner.token}" }
        let(:body) { { title: '', price_per_day: -5 } }
        run_test!
      end
    end
  end

  path '/api/v1/listings/{id}' do
    parameter name: :id, in: :path, type: :integer

    get 'Get a listing' do
      tags 'Listings'
      produces 'application/json'

      response '200', 'listing found' do
        let(:id) { listing.id }
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['id']).to eq(listing.id)
        end
      end

      response '404', 'not found' do
        let(:id) { 999999 }
        run_test!
      end
    end

    patch 'Update a listing' do
      tags 'Listings'
      security [{ bearerAuth: [] }]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :body, in: :body, schema: {
        type: :object,
        properties: {
          title: { type: :string },
          price_per_day: { type: :number }
        }
      }

      response '200', 'listing updated' do
        let(:id) { listing.id }
        let(:Authorization) { "Bearer #{owner.token}" }
        let(:body) { { title: 'Updated Title' } }
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['title']).to eq('Updated Title')
        end
      end

      response '403', 'forbidden - not the owner' do
        let(:id) { listing.id }
        let(:Authorization) { "Bearer #{other_user.token}" }
        let(:body) { { title: 'Hacked' } }
        run_test!
      end

      response '401', 'unauthorized' do
        let(:id) { listing.id }
        let(:Authorization) { 'Bearer invalid' }
        let(:body) { {} }
        run_test!
      end
    end

    delete 'Delete a listing' do
      tags 'Listings'
      security [{ bearerAuth: [] }]

      response '204', 'listing deleted' do
        let(:id) { listing.id }
        let(:Authorization) { "Bearer #{owner.token}" }
        run_test!
      end

      response '403', 'forbidden - not the owner' do
        let(:id) { listing.id }
        let(:Authorization) { "Bearer #{other_user.token}" }
        run_test!
      end
    end
  end
end
