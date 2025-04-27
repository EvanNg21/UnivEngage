module Api
    module V1
      class ClubsController < ApplicationController
        skip_before_action :authenticate_user!, only: [:create, :index, :update, :show, :destroy, :join, :leave, :members,]
        before_action :set_club, only: [:show, :update, :destroy,]

        def promote_to_admin
          club = Club.find(params[:id])
          user = User.find(params[:user_id]) # Assuming user_id is passed in the request
        
          # Find the club_member record and update the role to 'admin'
          club_member = club.club_members.find_by(user_id: user.id)
          if club_member&.update(role: 'admin')
            render json: { status: 'SUCCESS', message: 'User promoted to admin' }
          else
            render json: { status: 'ERROR', message: 'Failed to promote user to admin' }, status: :unprocessable_entity
          end
        end

        def demote_to_member
          club = Club.find(params[:id])
          user = User.find(params[:user_id]) # Assuming user_id is passed in the request
        
          # Find the club_member record and update the role to 'admin'
          club_member = club.club_members.find_by(user_id: user.id)
          if club_member&.update(role: 'member')
            render json: { status: 'SUCCESS', message: 'User demoted to member' }
          else
            render json: { status: 'ERROR', message: 'Failed to demote user to member' }, status: :unprocessable_entity
          end
        end
        
        def join
          club = Club.find(params[:id])
          user = User.find(params[:user_id]) # Assuming user_id is passed in the request
  
          if club.members << user
            render json: { status: 'SUCCESS', message: 'User joined the club' }
          else
            render json: { status: 'ERROR', message: 'Failed to join the club' }, status: :unprocessable_entity
          end
        end
  
        def leave
          club = Club.find(params[:id])
          user = User.find(params[:user_id])
          membership = club.club_members.find_by(user_id: user.id)
          
          if membership&.destroy
            render json: { status: 'SUCCESS', message: 'User left the club',member_count: club.reload.member_count}
          else
            render json: { status: 'ERROR', message: 'Failed to leave the club',errors: membership&.errors&.full_messages}, status: :unprocessable_entity
          end
        end
  
        def members
          club = Club.find(params[:id])
          members = club.members.select(:email, :first_name, :last_name, :user_id, :role)
  
          render json: { status: 'SUCCESS', members: members }
        rescue ActiveRecord::RecordNotFound
          render json: { status: 'ERROR', message: 'Club not found' }, status: :not_found
        end
  
        def index
          clubs = Club.select(:club_id, :club_name, :description, :created_at, :updated_at, :owner_id, :member_count)
          render json: clubs.map { |club| club.as_json.merge(club_picture_url: club.club_picture.attached? ? url_for(club.club_picture) : nil,
          members: club.members.select(:first_name, :last_name, :user_id, :email).map { |member| { first_name: member.first_name, last_name: member.last_name, user_id: member.user_id, email: member.email } }
          ) 
        }, status: :ok
        end
  
        def show
          @club = Club.find(params[:id])
          club_data = @club.as_json.merge(club_picture_url: @club.club_picture.attached? ? url_for(@club.club_picture) : nil,)
          club_data["members"] = club_data["members"].map do |member|
            {
              user_id: member["user_id"],
              username: member["username"],
              email: member["email"],
              first_name: member["first_name"],
              last_name: member["last_name"],
            }
          end
        
          render json: club_data, status: :ok
        end
  
        def update
          @club = Club.find(params[:id])
          if @club.update(club_params)
            render json: { status: "SUCCESS", club: @club }, status: :ok
          else
            render json: { status: "ERROR", club: @club.errors }, status: :unprocessable_entity
          end
        end
  
        def destroy
          @club.club_members.destroy_all
          @club.destroy
          render json: { status: "SUCCESS", club: @club }, status: :ok
        end
  
        def create # create club
          club = Club.new(club_params)
          if club.save
            owner = User.find(params[:owner_id])
            club.add_admin(owner) 
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
          params.require(:club).permit(:club_name, :club_id, :owner_id, :members, :description, :club_picture, :member_count)
        end
      end
    end
  end