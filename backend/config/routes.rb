Rails.application.routes.draw do
  resources :users, only: [:index, :create, :update, :destroy]
  resources :reservations, only: [:index, :show, :create, :update, :destroy]
  resources :shifts, only: [:index, :show, :create, :update, :destroy]
  resources :customers, only: [:show]
  resources :customer_memos, only: [:index, :create, :update, :destroy]
  resources :owner_messages, only: [:index, :create, :update, :destroy]

  # Freee API ルート
  get "/freee/employees", to: "freee#employees"
  post "/freee/time_clock", to: "freee#time_clock"

    # LINE
    post "line_checkin", to: "line_checkins#create"


  # Square API ルート
  scope :square do
    get "/bookings", to: "square#bookings"
    get "/bookings_with_memo", to: "square#bookings_with_memo"


  end
end
