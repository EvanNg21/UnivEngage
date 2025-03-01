module Api
    module V1
        class LoginsController < ApplicationController
            skip_before_action :authenticate_user!, only: [ :create ]
            def create
                user_param = params.require(:login).require(:user).permit(:email, :password)
                user = User.find_by(email: user_param[:email])

                # User not found
                unless user
                  render json: { status: "ERROR", message: "User not found" }, status: :not_found
                  Rails.logger.error "User not found"
                  return
                end

                # Authentication failed
                unless user.authenticate(user_param[:password])
                  render json: { status: "ERROR", message: "Invalid email or password" }, status: :unauthorized
                  Rails.logger.error "Invalid email or password"
                  return
                end

                # Success
                token = generate_token(user)
                render json: { status: "SUCCESS", user: user, token: token }, status: :ok
                Rails.logger.info "Login successful"
              end

            def generate_token(user)
                payload = { user_id: user.id, exp: 24.hours.from_now.to_i }
                JWT.encode(payload, Rails.application.credentials.secret_key_base)
                Rails.logger.info "Token generated"
            end
        end
    end
end
