Rails.application.routes.draw do
  devise_for :users, controllers: {
        sessions: 'users/sessions',
        registrations: 'users/registrations'
      }
  root to: 'pages#home'

  resources :pubs
  resources :crawls
  resources :favorite_pubs, only: [:create, :destroy]
  resources :favorite_crawls, only: [:create, :destroy]
end
