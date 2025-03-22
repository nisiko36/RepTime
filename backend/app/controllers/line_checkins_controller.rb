class LineCheckinsController < ApplicationController
  # POST /line_checkin
  def create
    checkin_type = params[:type]       # "new" or "repeat"
    seat_numbers = params[:seat_numbers] || []
    start_time = params[:start_at] ? Time.parse(params[:start_at]) : Time.current
    end_time   = start_time + 2.hours

    # ✅ 顧客の決定
    if checkin_type == "new"
      customer = create_random_new_customer
    elsif checkin_type == "repeat"
      customer = pick_existing_customer
      return render json: { error: "リピーターが存在しません" }, status: :not_found unless customer
    else
      return render json: { error: "type パラメータは 'new' または 'repeat' を指定してください" }, status: :unprocessable_entity
    end

    # 🔸 来店回数を更新
    customer.visit_count += 1
    customer.last_visit_at = start_time
    customer.save!

    # 🔹 Reservationを作成
    reservation = Reservation.create!(
      customer_id: customer.id,
      start_at: start_time,
      end_at: end_time,
      seat_numbers: seat_numbers,
      is_walk_in: true
    )

    render json: {
      status: "success",
      customer: {
        id: customer.id,
        name: customer.name,
        line_user_id: customer.line_user_id,
        visit_count: customer.visit_count
      },
      reservation: {
        id: reservation.id,
        start_at: reservation.start_at,
        seat_numbers: reservation.seat_numbers,
        is_walk_in: reservation.is_walk_in
      }
    }
  end

  private

  # ランダムなひらがな5文字で新規顧客を作成
  def create_random_new_customer
    random_name = 5.times.map { ("あ".."ん").to_a.sample }.join
    line_user_id = "U#{SecureRandom.hex(8)}"  # U+ランダム16桁

    Customer.create!(
      name: random_name,
      line_user_id: line_user_id,
      line_display_name: random_name,
      visit_count: 0
    )
  end

  # 既存の顧客からランダムで選ぶ（line_user_id が存在するもの）
  def pick_existing_customer
    Customer.where.not(line_user_id: nil).order("RANDOM()").first
  end
end
