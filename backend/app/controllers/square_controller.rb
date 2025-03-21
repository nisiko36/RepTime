class SquareController < ApplicationController
  before_action :initialize_service

  # 予約情報を取得
  def bookings
    bookings_data = @service.fetch_bookings

    if bookings_data.is_a?(Hash) && bookings_data[:error]
      render json: bookings_data, status: bookings_data[:status]
    else
      render json: bookings_data, status: :ok
    end
  end

  def bookings_with_memo
    bookings = @service.fetch_bookings

    if bookings.is_a?(Hash) && bookings[:error]
      render json: bookings, status: bookings[:status]
      return
    end

    result = bookings["bookings"].map do |booking|
      square_customer_id = booking["customer_id"]
      customer = Customer.find_by(square_customer_id: square_customer_id)

      customer_name = customer&.name || "名前不明"
      customer_id = customer&.id

      personal_memos = CustomerMemo.where(customer_id: customer_id, is_shared: false).pluck(:content)
      shared_memos   = CustomerMemo.where(customer_id: customer_id, is_shared: true).pluck(:content)


      {
        id: booking["id"],
        customer_id: square_customer_id,
        customer_name: customer_name,
        start_at: booking["start_at"],
        duration_minutes: booking.dig("appointment_segments", 0, "duration_minutes"),
        personal_memos: personal_memos.presence || ["なし"],
        shared_memos: shared_memos.presence || ["なし"]
      }
    end

    render json: result, status: :ok
  end


  private

  def initialize_service
    @service = SquareApiService.new
  rescue => e
    render json: { error: "APIの初期化に失敗しました: #{e.message}" }, status: :internal_server_error
  end
end
