class ApplicationController < ActionController::API
    before_action :authenticate_user!

    private

    def authenticate_user!
        token = request.headers["Authorization"]&.split('Bearer ')&.last
        if token
          Rails.logger.info "Token received: #{token}"
          begin
            decoded_token = JWT.decode(token, nil , false)
            @current_user = User.find(decoded_token[0]["user_id"])
            Rails.logger.info "#{decoded_token[0]['user_id']} User authenticated: #{@current_user.email}"
          rescue JWT::DecodeError => e
            Rails.logger.error "Token decode error: #{e.message}"
            render json: { status: "ERROR", message: "Invalid token" }, status: :unauthorized
          end
        else
          Rails.logger.error "Authorization header missing"
          render json: { status: "ERROR", message: "Token missing" }, status: :unauthorized
        end
      end
    def current_user
        @current_user
    end
end
