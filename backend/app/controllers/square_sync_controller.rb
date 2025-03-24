class SquareSyncController < ApplicationController
  before_action :initialize_service

  def sync_today
    # クエリパラメータ 'date' があればパース、なければ今日
    date = params[:date].present? ? Date.parse(params[:date]) : Date.current
    square_bookings = @service.fetch_bookings(date)

    square_bookings["bookings"].each do |booking|
      square_customer_id = booking["customer_id"]
      start_at = booking["start_at"]
      duration = booking.dig("appointment_segments", 0, "duration_minutes") || 90
      end_at   = Time.parse(start_at) + duration.minutes
      service_variation_id = booking.dig("appointment_segments", 0, "service_variation_id")

      # サービスIDから人数（party_size）を判定
      party_size = case service_variation_id
                    when "JK2PNDNZFZSHW34AD7VZKPNF" then 1
                    when "35ULX5K4KQNTPJTDTTTXPY2E" then 2
                    when "VV5DFAGQHZNOWABX5PGKUGVG" then 3
                    when "64LY3JSOGOMPWXZ6J5QUAXJK" then 4
                    else nil
                    end

      # Square APIから顧客名を取得
      customer_name = @service.fetch_customer_name(square_customer_id)

      # 顧客をSquareIDで検索。新規の場合は作成、既存ならvisit_countをインクリメント
      customer = Customer.find_or_initialize_by(square_customer_id: square_customer_id)
      if customer.new_record?
        customer.name = customer_name.presence || "Square顧客"
        customer.visit_count = 0
        customer.save!
      else
        customer.update!(
          name: customer_name.presence || customer.name,
        )
      end

      # 既に同じSquare予約が登録済みの場合はスキップ
      next if Reservation.exists?(square_booking_id: booking["id"])

      # 人数に応じて席番号を割り当てる
      seat_numbers = generate_seats(party_size)

      # 予約登録
      Reservation.create!(
        customer_id: customer.id,
        start_at: start_at,
        end_at: end_at,
        square_booking_id: booking["id"],
        seat_numbers: seat_numbers,
        is_walk_in: false,
        party_size: party_size
      )
    end

    render json: { status: "synced", date: date.to_s }, status: :ok
  end

  private

  def initialize_service
    @service = SquareApiService.new
  end

  # 利用可能な席番号：A1, A2, B1, B2, C1, C2, D1, D2
  # 1～2人なら1席、3～4人なら2席をランダムで割り当てる
  def generate_seats(party_size)
    return [] unless party_size

    letters = ["A", "B", "C", "D"]

    if party_size <= 2
      # 1席の場合は、ランダムに1つの席を選ぶ
      letter = letters.sample
      ["#{letter}1"]
    else
      # 2席の場合は、ランダムに1つのアルファベットを選び、その同じ文字で "1" と "2" を作る
      letter = letters.sample
      ["#{letter}1", "#{letter}2"]
    end
  end
end

