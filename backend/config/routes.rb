Rails.application.routes.draw do
  resources :users, only: [:index, :create, :update, :destroy]
  resources :reservations, only: [:index, :show, :create, :update, :destroy]
  resources :shifts, only: [:index, :show, :create, :update, :destroy]
  resources :shifts, only: [:index, :create, :update, :destroy]
  resources :customers, only: [:show]
  resources :customer_memos, only: [:index, :create, :update, :destroy]
  resources :owner_messages, only: [:index, :create, :update, :destroy]
end
