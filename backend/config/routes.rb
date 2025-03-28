Rails.application.routes.draw do
  resources :users, only: [:index, :create, :update, :destroy]

  resources :reservations, only: [:index, :show, :create, :update, :destroy] do
    collection do
      # 日付指定で予約一覧を取得
      get :by_date
    end
  end

  resources :shifts, only: [:index, :show, :create, :update, :destroy]
  resources :customers, only: [:index, :show, :update]
  resources :customer_memos, only: [:index, :create, :update, :destroy]
  resources :owner_messages, only: [:index, :create, :update, :destroy]
  resources :attendance_memos, only: [:index, :create, :update, :destroy]


  # Freee API ルート
  get "/freee/employees", to: "freee#employees"
  post "/freee/time_clock", to: "freee#time_clock"

  # LINE チェックイン
  post "/line_checkin", to: "line_checkins#create"
  post "/test_scenarios/create_data", to: "test_scenarios#create_data"


  # Square 予約読み取りを Reservation に同期
  post "/square_sync/today", to: "square_sync#sync_today"

  # Square API ルート
  scope :square do
    get "/bookings", to: "square#bookings"
    get "/bookings_with_memo", to: "square#bookings_with_memo"
  end
end
