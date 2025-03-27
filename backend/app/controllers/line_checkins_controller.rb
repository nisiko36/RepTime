class LineCheckinsController < ApplicationController
  def create
    checkin_type = params[:type]
    seat_numbers = params[:seat_numbers] || []
    # square_customer_id と line_user_id は、test_repeat用の照合パラメータとして受け取る
    req_square_customer_id = params[:square_customer_id]
    req_line_user_id = params[:line_user_id]

    return render json: { error: "start_at を指定してください" }, status: :bad_request unless params[:start_at]
    start_time = Time.parse(params[:start_at])
    end_time   = start_time + 2.hours

    # まず、予約の時間（±15分）とseat_numbersで該当予約を取得
    reservation = Reservation
      .where("start_at BETWEEN ? AND ?", start_time - 15.minutes, start_time + 15.minutes)
      .where("seat_numbers && ARRAY[?]::varchar[]", seat_numbers)
      .includes(:customer)
      .order(:start_at)
      .first

    return render json: { error: "一致する予約が見つかりません" }, status: :not_found unless reservation

    case checkin_type
    when "new"
      # newの場合は、予約に紐づく顧客がいれば利用し、なければ新規作成
      customer = reservation.customer || create_random_new_customer

    when "repeat"
      # repeatの場合は、予約に紐づく顧客を必ず使用
      customer = reservation.customer
      return render json: { error: "予約に紐づく顧客が存在しません (repeat)" }, status: :not_found unless customer

    when "test_repeat"
      # test_repeat: 予約に紐づく顧客を取得し、square_customer_id または line_user_id が
      # 送信パラメータと一致しているか確認する
      customer = reservation.customer
      return render json: { error: "予約に紐づく顧客が存在しません (test_repeat)" }, status: :not_found unless customer

      # square_customer_id の照合（もしパラメータが渡されていれば）
      if req_square_customer_id.present? && customer.square_customer_id != req_square_customer_id
        # square_customer_idが一致しなければ、line_user_idでの照合を試みる
        if req_line_user_id.present? && customer.line_user_id == req_line_user_id
          # OK
        else
          return render json: { error: "顧客情報が一致しません (square_customer_id 不一致)" }, status: :not_found
        end
      end

      # もしline_user_idがパラメータで渡されている場合は、照合（ただし、すでに登録済みならそのまま）
      if req_line_user_id.present? && customer.line_user_id.present? && customer.line_user_id != req_line_user_id
        return render json: { error: "顧客情報が一致しません (line_user_id 不一致)" }, status: :not_found
      end

    else
      return render json: { error: "type パラメータは 'new', 'repeat', 'test_repeat' のいずれかを指定してください" }, status: :unprocessable_entity
    end

    # 共通処理：顧客情報更新（visit_count の増加、last_visit_at 更新）
    customer.update!(
      visit_count: customer.visit_count.to_i + 1,
      last_visit_at: start_time,
      # もしまだ登録されていなければ、line_user_id をパラメータから採用
      line_user_id: customer.line_user_id.presence || req_line_user_id || "U#{SecureRandom.hex(8)}"
    )

    # 予約に顧客IDを紐づけ（未設定なら更新）
    reservation.update!(customer_id: customer.id)

    render json: {
      status: "success",
      customer: {
        id: customer.id,
        name: customer.name,
        square_customer_id: customer.square_customer_id,
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

  def create_random_new_customer
    name = 5.times.map { ("あ".."ん").to_a.sample }.join
    Customer.create!(
      name: name,
      line_user_id: "U#{SecureRandom.hex(8)}",
      line_display_name: name,
      visit_count: 0
    )
  end
end
