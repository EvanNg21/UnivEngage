module Api
    module V1
        class UsersController < ApplicationController
            before_action :set_user, only: [ :show, :update, :destroy]

            def index
                users = User.all
                render json: { status: 'SUCCESS', users: users}, status: :ok
            end

            def show
                render json: { status: 'SUCCESS', user: @user}, status: :ok
            end

            def update
                if @user.update(user_params)
                    render json: { status: 'SUCCESS', user: @user}, status: :ok
                else
                    render json: { status: 'ERROR', user: @user.errors}, status: :unprocessable_entity
                end
            end

            def destroy
                @user.destroy
                render json: { status: 'SUCCESS', user: @user}, status: :ok
            end

            def create # create user
                user = User.new(user_params)
                if user.save
                    render json: { status: 'SUCCESS', user: user}, status: :created
                else
                    render json: { status: 'ERROR', user: user.errors}, status: :unprocessable_entity
                end
            end 

            private 

            def user_params # only allow a list of trusted parameters through
                params.require(:user).permit(:email, :password)
            end
        end
    end
end