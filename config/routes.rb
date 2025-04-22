Rails.application.routes.draw do
  # API routes should be in /api/v1
  namespace :api do
    namespace :v1 do
      post 'logins', to: 'logins#create'
      resources :posts do
        member do
          get 'likes', to: 'posts#likes'
          post 'like', to: 'posts#like'
          delete 'unlike', to: 'posts#unlike'
        end
      end
      resources :events do
        member do
          get 'attending', to: 'events#attending'
          post 'attend', to: 'events#attend'
          delete 'unattend', to: 'events#unattend'
        end
      end
      resources :clubs do
        member do
          get 'members', to: 'clubs#members'
          post 'join', to: 'clubs#join'
          post 'promote_to_admin', to: 'clubs#promote_to_admin'
          post 'demote_to_member', to: 'clubs#demote_to_member'
          delete 'leave', to: 'clubs#leave'
        end
      end
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
