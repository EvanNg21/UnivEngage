module Api
  module V1
      class PostsController < ApplicationController
          skip_before_action :authenticate_user!, only: [:index, :create, :show, :destroy, :update]
          before_action :set_post, only: [:show, :edit, :update, :destroy]

          def index
            posts = Post.all
            render json: posts.map { |post| post.as_json.merge(post_image: post.post_image.attached? ? url_for(post.post_image) : nil) }, status: :ok
          end

          def show
            @posts = Post.find(params[:id])
            render json: @post.as_json.merge(post_image: @post.post_image.attached? ? url_for(@post.post_image) : nil), status: :ok
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
         



