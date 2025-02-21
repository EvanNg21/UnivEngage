Rails.application.routes.draw do
  # API routes should be in /api/v1
  namespace :api do
    namespace :v1 do
      resources :posts
      resources :users do
        collection do
          delete :destroy_multiple
        end
      end
    end
  end
   
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/") 
  # root "posts#index"
end
