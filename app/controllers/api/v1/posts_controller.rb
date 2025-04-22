module Api
    module V1
        class PostsController < ApplicationController
            skip_before_action :authenticate_user!, only: [:index, :create, :show, :destroy, :update, :likes, :like, :unlike]
            before_action :set_post, only: [:show, :edit, :update, :destroy]

            def index
                posts = Post.all
                render json: posts.map { |post| post.as_json.merge(post_image: post.post_image.attached? ? url_for(post.post_image) : nil) }, status: :ok
            end

            def show
                post = Post.find(params[:id])
                post_data = post.as_json.merge(post_image: post.post_image.attached? ? url_for(post.post_image) : nil)
                liked_users = post.users.select(:user_id, :username, :email, :first_name, :last_name)
                post_data["liked_by"] = liked_users.map do |user|
                  {
                    user_id: user.user_id,
                    username: user.username,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                  }
                end
              
                render json: post_data, status: :ok
              end

            def new
                @posts = Post.new
            end

            def create
                @posts = Post.new(post_params)
                if @posts.save
                    render json: {status: "SUCCESS", posts: @posts }, status: :created
                else
                    render json: {status: "ERROR", posts: @posts.errors }, status: :unprocessable_entity
                end
            end

            def edit
            end

            def update
                if @posts.update(post_params)
                    render json: {status: "SUCCESS", posts: @posts }, status: :ok
                else
                    render json: {status: "ERROR", posts: @posts.errors }, status: :unprocessable_entity
                end
            end

            def destroy
                if @posts.destroy
                    render json: {status: "SUCCESS", posts: @posts }, status: :ok
                else
                    render json: {status: "ERROR", posts: @posts.errors }, status: :unprocessable_entity
                end
            end

            def like
                post = Post.find(params[:id])
                user = User.find(params[:user_id])
        
                if post.users << user
                    render json: { status: 'SUCCESS', message: 'User liked this post' }
                else
                    render json: { status: 'ERROR', message: 'Failed to like' }, status: :unprocessable_entity
                end
            end

            def unlike
                post = Post.find(params[:id])
                user = User.find(params[:user_id]) # Assuming user_id is passed in the request
        
                if post.users.delete(user)
                    render json: { status: 'SUCCESS', message: 'User is no longer attending event', like_count: post.reload.likes_count }
                else
                    render json: { status: 'ERROR', message: 'Failed to unattend event' }, status: :unprocessable_entity
                end
            end

            def likes
                post = Post.find(params[:id])
                liked = post.users.select(:email, :first_name, :last_name, :user_id)
  
                render json: { status: 'SUCCESS', liked: liked } 
            end
                
            private

            def set_post
                @posts = Post.find(params[:id])
            rescue ActiveRecord::RecordNotFound
                render json: { status: "ERROR", message: "Post not found" }, status: :not_found
            end

            def post_params
                params.require(:post).permit(:post_id, :post_name, :content, :user_id, :club_id, :views_count, :likes_count, :comments_count, :post_image)
            end
        end 
    end
end
         



