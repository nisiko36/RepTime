Rails.application.routes.draw do
  resources :users, only: [:index, :show, :create, :update, :destroy]
  resources :reservations, only: [:index, :show, :create, :update, :destroy]
  resources :shifts, only: [:index, :show, :create, :update, :destroy]
end
