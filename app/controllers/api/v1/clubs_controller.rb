module Api
    module V1
        class ClubsController < ApplicationController
            skip_before_action :authenticate_user!, only: [ :create, :index, :update, :show, :destroy ]
            before_action :set_club, only: [ :show, :update, :destroy ]

            def index
                clubs = Club.all
                render json: { status: "SUCCESS", clubs: clubs }, status: :ok
            end

            def show
                render json: { status: "SUCCESS", club:@club }, status: :ok
            end

            def update
                if @club.update(club_params)
                    render json: { status: "SUCCESS", club: @club }, status: :ok
                else
                    render json: { status: "ERROR", club: @club.errors }, status: :unprocessable_entity
                end
            end

            def destroy
                @club.destroy
                render json: { status: "SUCCESS", club: @club }, status: :ok
            end

            def create # create club
                club = Club.new(club_params)
                if club.save
                    render json: { status: "SUCCESS", club: club }, status: :created
                else
                    render json: { status: "ERROR", club: club.errors }, status: :unprocessable_entity
                end
            end

            private

            def set_club
                @club = Club.find(params[:id])
            rescue ActiveRecord::RecordNotFound
                render json: { status: "ERROR", message: "Club not found" }, status: :not_found
            end

            def club_params # only allow a list of trusted parameters through
                params.require(:club).permit(:club_name, :club_id, :owner_id, :members, :description)
            end
        end
    end
end
