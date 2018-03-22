Rails.application.routes.draw do
  devise_for :users
  root to: 'pages#home'

  resources :pubs
  resources :favorite_pubs, only: [:create, :destroy]
end
