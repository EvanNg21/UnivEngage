module Api
    module V1
        class LoginsController < ApplicationController
            def create
                user_param = params.require(:login).require(:user).permit(:email, :password)
                user = User.find_by(email: user_param[:email])
                if user
                    Rails.logger.info "User found: #{user.email}"
                else
                    Rails.logger.info "User not found with email: #{user_param[:email]}"
                end

                if user && user.authenticate(user_param[:password])
                    session[:user_id] = user.id
                    render json: { status: "SUCCESS", user: user }, status: :ok
                else
                    Rails.logger.info "Authentication failed for user: #{user_param[:email]}"
                    # Temporary logging for debugging purposes
                    Rails.logger.info "Password attempted: #{user_param[:password]}"
                    render json: { status: "ERROR", message: "Invalid email or password" }, status: :unauthorized
                end
            end
        end 
    end
end