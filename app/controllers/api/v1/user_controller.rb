module Api
    module V1
        class UsersController < ApplicationController
            protect_from_forgery with: :null_session

            def create # create user
                user = User.new(user_params)
                if user.save
                    render json: {status: 'SUCCESS', user: user}, status: : created 
                else
                    render json: {status: 'ERROR', user: user.errors}, status: :unprocessable_entity
                end
            end 

            private 

            def user_params # only allow a list of trusted parameters through
                params.require(:user).permit(:email, :password)
            end
        end
    end
end