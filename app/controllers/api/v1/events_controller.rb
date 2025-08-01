module Api
    module V1
        class EventsController < ApplicationController
            skip_before_action :authenticate_user!, only: [:index, :create, :show, :destroy, :update, :attend, :unattend, :attending]
            before_action :set_event, only: [:show, :edit, :update, :destroy]

            def index
                @events = Event.all
                render json: { status: "SUCCESS", events: @events }, status: :ok
            end

            def show
                render json: { status: "SUCCESS", events: @event }, status: :ok
            end

            def new
                @event = Event.new
            end

            def create
                @event = Event.new(event_params)
                if @event.save
                    render json: {status: "SUCCESS", events: @event }, status: :created
                else
                    render json: {status: "ERROR", events: @event.errors }, status: :unprocessable_entity
                end
            end

            def edit
            end

            def update
                if @event.update(event_params)
                    render json: {status: "SUCCESS", events: @event }, status: :ok
                else
                    render json: {status: "ERROR", events: @event.errors }, status: :unprocessable_entity
                end
            end

            def destroy
                if @event.destroy
                    render json: {status: "SUCCESS", events: @event }, status: :ok
                else
                    render json: {status: "ERROR", events: @event.errors }, status: :unprocessable_entity
                end
            end

            def attend
                event = Event.find(params[:id])
                user = User.find(params[:user_id])
        
                if event.users << user
                    render json: { status: 'SUCCESS', message: 'User is attending event' }
                else
                    render json: { status: 'ERROR', message: 'Failed to attend event' }, status: :unprocessable_entity
                end
            end

            def unattend
                event = Event.find(params[:id])
                user = User.find(params[:user_id]) # Assuming user_id is passed in the request
        
                if event.users.delete(user)
                    render json: { status: 'SUCCESS', message: 'User is no longer attending event' }
                else
                    render json: { status: 'ERROR', message: 'Failed to unattend event' }, status: :unprocessable_entity
                end
            end

            def attending
                event = Event.find(params[:id])
                attending = event.users.select(:email, :first_name, :last_name, :user_id)
  
                render json: { status: 'SUCCESS', attending: attending } 
            end

            private

            def set_event
                @event = Event.find(params[:id])
            rescue ActiveRecord::RecordNotFound
                render json: { status: "ERROR", message: "Event not found" }, status: :not_found
            end

            def event_params
                params.require(:event).permit(:event_name, :description, :event_date, :start_time, :end_time, :location, :club_id)
            end
        end 
    end
end
           



