require 'swagger_helper'

RSpec.describe 'Messages API', type: :request do
  let(:owner) { create(:user) }
  let(:hirer) { create(:user) }
  let(:outsider) { create(:user) }
  let(:listing) { create(:rv_listing, owner: owner) }
  let!(:booking) { create(:booking, hirer: hirer, rv_listing: listing) }

  path '/api/v1/listings/{listing_id}/messages' do
    parameter name: :listing_id, in: :path, type: :integer

    get 'List messages for a listing' do
      tags 'Messages'
      security [{ bearerAuth: [] }]
      produces 'application/json'

      response '200', 'messages retrieved by owner' do
        before { create(:message, user: hirer, rv_listing: listing) }
        let(:listing_id) { listing.id }
        let(:Authorization) { "Bearer #{owner.token}" }
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data).to be_an(Array)
          expect(data.first['user']).to have_key('name')
        end
      end

      response '200', 'messages retrieved by hirer with booking' do
        let(:listing_id) { listing.id }
        let(:Authorization) { "Bearer #{hirer.token}" }
        run_test!
      end

      response '403', 'forbidden - no booking and not owner' do
        let(:listing_id) { listing.id }
        let(:Authorization) { "Bearer #{outsider.token}" }
        run_test!
      end

      response '401', 'unauthorized' do
        let(:listing_id) { listing.id }
        let(:Authorization) { 'Bearer invalid' }
        run_test!
      end
    end

    post 'Send a message' do
      tags 'Messages'
      security [{ bearerAuth: [] }]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :body, in: :body, schema: {
        type: :object,
        properties: {
          content: { type: :string }
        },
        required: ['content']
      }

      response '201', 'message created by hirer' do
        let(:listing_id) { listing.id }
        let(:Authorization) { "Bearer #{hirer.token}" }
        let(:body) { { content: 'Is the RV pet-friendly?' } }
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['content']).to eq('Is the RV pet-friendly?')
          expect(data['user']['id']).to eq(hirer.id)
        end
      end

      response '201', 'message created by owner' do
        let(:listing_id) { listing.id }
        let(:Authorization) { "Bearer #{owner.token}" }
        let(:body) { { content: 'Yes, pets welcome!' } }
        run_test!
      end

      response '403', 'forbidden - no booking and not owner' do
        let(:listing_id) { listing.id }
        let(:Authorization) { "Bearer #{outsider.token}" }
        let(:body) { { content: 'Trying to sneak in' } }
        run_test!
      end

      response '422', 'empty content' do
        let(:listing_id) { listing.id }
        let(:Authorization) { "Bearer #{hirer.token}" }
        let(:body) { { content: '' } }
        run_test!
      end
    end
  end
end
