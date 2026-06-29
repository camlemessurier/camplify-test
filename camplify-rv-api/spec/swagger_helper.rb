require 'rails_helper'

RSpec.configure do |config|
  config.openapi_root = Rails.root.join('swagger').to_s

  config.openapi_specs = {
    'v1/swagger.yaml' => {
      openapi: '3.0.1',
      info: {
        title: 'RV Marketplace API',
        version: 'v1',
        description: 'A two-sided marketplace API connecting RV owners with renters'
      },
      paths: {},
      components: {
        securitySchemes: {
          bearerAuth: {
            type: :http,
            scheme: :bearer
          }
        },
        schemas: {
          User: {
            type: :object,
            properties: {
              id: { type: :integer },
              name: { type: :string },
              email: { type: :string }
            }
          },
          RvListing: {
            type: :object,
            properties: {
              id: { type: :integer },
              title: { type: :string },
              description: { type: :string },
              location: { type: :string },
              price_per_day: { type: :string },
              owner: { '$ref' => '#/components/schemas/User' },
              created_at: { type: :string, format: 'date-time' }
            }
          },
          Booking: {
            type: :object,
            properties: {
              id: { type: :integer },
              start_date: { type: :string, format: :date },
              end_date: { type: :string, format: :date },
              status: { type: :string, enum: ['pending', 'confirmed', 'rejected'] },
              rv_listing: {
                type: :object,
                properties: {
                  id: { type: :integer },
                  title: { type: :string },
                  location: { type: :string }
                }
              },
              created_at: { type: :string, format: 'date-time' }
            }
          },
          Message: {
            type: :object,
            properties: {
              id: { type: :integer },
              content: { type: :string },
              user: { '$ref' => '#/components/schemas/User' },
              created_at: { type: :string, format: 'date-time' }
            }
          },
          Error: {
            type: :object,
            properties: {
              error: { type: :string }
            }
          },
          Errors: {
            type: :object,
            properties: {
              errors: { type: :array, items: { type: :string } }
            }
          }
        }
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Development server' }
      ]
    }
  }

  config.openapi_format = :yaml
end
