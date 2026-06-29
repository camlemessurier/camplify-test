require 'swagger_helper'

RSpec.describe 'Auth API', type: :request do
  path '/api/v1/auth/register' do
    post 'Register a new user' do
      tags 'Auth'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :body, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string, example: 'Alice Smith' },
          email: { type: :string, example: 'alice@example.com' },
          password: { type: :string, example: 'password123' }
        },
        required: %w[name email password]
      }

      response '201', 'user registered' do
        let(:body) { { name: 'Alice', email: 'alice@example.com', password: 'password123' } }
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['token']).to be_present
          expect(data['user']['email']).to eq('alice@example.com')
        end
      end

      response '422', 'invalid parameters' do
        let(:body) { { name: '', email: 'bad', password: 'short' } }
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['errors']).to be_present
        end
      end
    end
  end

  path '/api/v1/auth/login' do
    post 'Login' do
      tags 'Auth'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :body, in: :body, schema: {
        type: :object,
        properties: {
          email: { type: :string },
          password: { type: :string }
        },
        required: %w[email password]
      }

      response '200', 'login successful' do
        let(:user) { create(:user, email: 'bob@example.com', password: 'password123') }
        let(:body) { { email: user.email, password: 'password123' } }
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['token']).to be_present
        end
      end

      response '401', 'invalid credentials' do
        let(:body) { { email: 'wrong@example.com', password: 'wrongpass' } }
        run_test!
      end
    end
  end

  path '/api/v1/auth/logout' do
    delete 'Logout' do
      tags 'Auth'
      security [{ bearerAuth: [] }]
      produces 'application/json'

      response '204', 'logged out successfully' do
        let(:user) { create(:user) }
        let(:Authorization) { "Bearer #{user.token}" }
        run_test!
      end

      response '401', 'unauthorized' do
        let(:Authorization) { 'Bearer invalid' }
        run_test!
      end
    end
  end
end
