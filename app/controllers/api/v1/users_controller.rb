module Api
    module V1
        class UsersController < ApplicationController
            skip_before_action :authenticate_user!, only: [ :create, :index, :update, :show ]
            before_action :set_user, only: [ :show, :update, :destroy ]

            def index
                users = User.all
                render json: users.map { |user| user.as_json.merge(profile_picture_url: user.profile_picture.attached? ? url_for(user.profile_picture) : nil) }, status: :ok
            end

            def show
                @user = User.find(params[:id])
                render json: @user.as_json.merge(profile_picture_url: @user.profile_picture.attached? ? url_for(@user.profile_picture) : nil), status: :ok
            end

            def update
                @user = User.find(params[:id])
                if @user.update(user_params)
                  render json: { user: @user }, status: :ok
                else
                  render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
                end
            end

            def destroy
                @user.destroy
                render json: { status: "SUCCESS", user: @user }, status: :ok
            end

            def create # create user
                user = User.new(user_params)
                if user.save
                    render json: { status: "SUCCESS", user: user }, status: :created
                else
                    render json: { status: "ERROR", user: user.errors }, status: :unprocessable_entity
                end
            end

            def destroy_multiple
                user_ids = params[:ids]
                render json: { status: "SUCCESS", message: "Users deleted" }, status: :ok
                if user_ids.nil? || !user_ids.is_a?(Array)
                    render json: { status: "ERROR", message: "Invalid user_ids parameter" }, status: :unprocessable_entity
                    return
                end
                deleted_users = User.where(id: user_ids).destroy_all
                render json: { status: "SUCCESS", message: "Users deleted", deleted_users: deleted_users }, status: :ok
            end

            private

            def set_user
                @user = User.find(params[:id])
            rescue ActiveRecord::RecordNotFound
                render json: { status: "ERROR", message: "User not found" }, status: :not_found
            end

            def user_params # only allow a list of trusted parameters through
                params.require(:user).permit(:email, :password, :first_name, :last_name, :bio, :date_of_birth, :username, :profile_picture)
            end
        end
    end
end
