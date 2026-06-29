module Api
  module V1
    class AuthController < ApplicationController
      before_action :authenticate_user!, only: [:logout]

      def register
        user = User.new(register_params)
        user.save!
        render json: user_response(user), status: :created
      end

      def login
        user = User.find_by(email: login_params[:email])
        if user&.authenticate(login_params[:password])
          user.regenerate_token!
          render json: user_response(user), status: :ok
        else
          render json: { error: "Invalid email or password" }, status: :unauthorized
        end
      end

      def logout
        current_user.invalidate_token!
        head :no_content
      end

      private

      def register_params
        params.permit(:name, :email, :password, :password_confirmation)
      end

      def login_params
        params.permit(:email, :password)
      end

      def user_response(user)
        {
          user: { id: user.id, name: user.name, email: user.email },
          token: user.token
        }
      end
    end
  end
end
