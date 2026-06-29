Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'

  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      post   'auth/register', to: 'auth#register'
      post   'auth/login',    to: 'auth#login'
      delete 'auth/logout',   to: 'auth#logout'

      resources :listings do
        resources :bookings, only: [:create]
        resources :messages, only: [:index, :create]
      end

      resources :bookings, only: [] do
        collection do
          get :as_hirer
          get :as_owner
        end
        member do
          patch :confirm
          patch :reject
        end
      end
    end
  end
end
