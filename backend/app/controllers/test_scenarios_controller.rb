class TestScenariosController < ApplicationController
  # POST /test_scenarios/create_data
  # パラメータ例（JSONまたはURLクエリパラメータ）
  # {
  #   "scenario": "1",
  #   "name": "山田太郎",
  #   "start_at": "2025-04-01T09:00:00Z",
  #   "end_at": "2025-04-01T11:00:00Z",
  #   "seat_numbers": ["A1"],
  #   "party_size": "2",
  #   "line_user_id": "U12345678",
  #   "square_customer_id": "SQ87654321",
  #   "square_booking_id": "SB11223344",
  #   "date": "2025-04-01"
  # }
  def create_data
    scenario = params[:scenario].to_i

    reservation =
      case scenario
      when 1 then create_new_customer_no_reservation_manual(is_repeat: false)
      when 2 then create_repeat_customer_no_reservation_manual(is_repeat: true)
      when 3 then create_square_repeat_reservation_manual(is_repeat: true)
      when 4 then create_line_only_then_square_manual(is_repeat: true)
      when 5 then create_new_square_reservation_manual(is_repeat: false)
      else
        return render json: { error: "scenario は 1～5 のいずれかを指定してください" }, status: :bad_request
      end

    render json: {
      scenario: scenario,
      reservation: reservation.as_json(include: :customer)
    }, status: :ok
  end

  # パラメータ指定がなければランダムな日本語名を生成
  def random_japanese_name(length = 5)
    (1..length).map { ("あ".."ん").to_a.sample }.join
  end

  def parse_time(param_key)
    if params[param_key].present?
      Time.parse(params[param_key])
    else
      t = Time.now.change(min: 0, sec: 0) + 1.hour
      param_key == :start_at ? t : t + 2.hours
    end
  end

  def get_seat_numbers
    params[:seat_numbers].presence || []
  end

  def get_party_size
    params[:party_size].present? ? params[:party_size].to_i : 1
  end

  # 【ケース1】予約なし・初回（New）
  def create_new_customer_no_reservation_manual(is_repeat:)
    customer = Customer.create!(
      name: params[:name].presence || random_japanese_name,
      visit_count: 0,
      line_user_id: params[:line_user_id].presence || "U#{SecureRandom.hex(8)}"
    )

    Reservation.create!(
      customer: customer,
      start_at: parse_time(:start_at),
      end_at: parse_time(:end_at),
      seat_numbers: get_seat_numbers,
      is_walk_in: true,
      is_repeat: is_repeat,
      party_size: get_party_size,
      square_booking_id: nil
    )
  end

  # 【ケース2】予約なし・リピート（Repeat）
  def create_repeat_customer_no_reservation_manual(is_repeat:)
    customers = Customer.where("visit_count >= 1").where.not(line_user_id: nil)
    customer = if params[:customer_id].present?
                 customers.find_by(id: params[:customer_id])
               else
                 customers.order("RANDOM()").first
               end

    customer ||= Customer.create!(
      name: params[:name].presence || random_japanese_name,
      visit_count: 1,
      line_user_id: params[:line_user_id].presence || "U#{SecureRandom.hex(8)}"
    )

    customer.update!(
      visit_count: customer.visit_count + 1,
      last_visit_at: parse_time(:start_at),
      line_user_id: customer.line_user_id.presence || params[:line_user_id] || "U#{SecureRandom.hex(8)}"
    )

    Reservation.create!(
      customer: customer,
      start_at: parse_time(:start_at),
      end_at: parse_time(:end_at),
      seat_numbers: get_seat_numbers,
      is_walk_in: true,
      is_repeat: is_repeat,
      party_size: get_party_size,
      square_booking_id: nil
    )
  end

  # 【ケース3】予約あり・2回目以降（Square予約、Square IDでリピート）
  def create_square_repeat_reservation_manual(is_repeat:)
    customers = Customer.where.not(square_customer_id: nil).where("visit_count >= 1")
    customer = if params[:customer_id].present?
                 customers.find_by(id: params[:customer_id])
               else
                 customers.order("RANDOM()").first
               end

    customer ||= Customer.create!(
      name: params[:name].presence || random_japanese_name,
      visit_count: 1,
      square_customer_id: params[:square_customer_id].presence || "SQ-#{SecureRandom.hex(8)}"
    )

    customer.update!(
      visit_count: customer.visit_count + 1,
      last_visit_at: parse_time(:start_at),
      line_user_id: customer.line_user_id.presence || params[:line_user_id]
    )

    Reservation.create!(
      customer: customer,
      start_at: parse_time(:start_at),
      end_at: parse_time(:end_at),
      seat_numbers: get_seat_numbers,
      is_walk_in: false,
      is_repeat: is_repeat,
      party_size: get_party_size,
      square_booking_id: params[:square_booking_id].presence || "SB-#{SecureRandom.hex(8)}"
    )
  end

  # 【ケース4】初回はLINEのみ→2回目Square予約（ID分裂再現）
  def create_line_only_then_square_manual(is_repeat:)
    line_only_customer = Customer.create!(
      name: params[:name].presence || random_japanese_name,
      visit_count: 1,
      line_user_id: params[:line_user_id].presence || "U#{SecureRandom.hex(8)}",
      square_customer_id: nil
    )

    square_only_customer = Customer.create!(
      name: params[:name].presence || random_japanese_name,
      visit_count: 0,
      square_customer_id: params[:square_customer_id].presence || "SQ-#{SecureRandom.hex(8)}",
      line_user_id: nil
    )

    square_only_customer.update!(
      visit_count: 1,
      last_visit_at: parse_time(:start_at),
      line_user_id: params[:line_user_id] || "U#{SecureRandom.hex(8)}"
    )

    Reservation.create!(
      customer: square_only_customer,
      start_at: parse_time(:start_at),
      end_at: parse_time(:end_at),
      seat_numbers: get_seat_numbers,
      is_walk_in: false,
      is_repeat: is_repeat,
      party_size: get_party_size,
      square_booking_id: params[:square_booking_id].presence || "SB-#{SecureRandom.hex(8)}"
    )
  end

  # 【ケース5】予約あり・初来店（Square予約で初回）
  def create_new_square_reservation_manual(is_repeat:)
    customer = Customer.create!(
      name: params[:name].presence || random_japanese_name,
      visit_count: 0,
      square_customer_id: params[:square_customer_id].presence || "SQ-#{SecureRandom.hex(8)}"
    )

    Reservation.create!(
      customer: customer,
      start_at: parse_time(:start_at),
      end_at: parse_time(:end_at),
      seat_numbers: get_seat_numbers,
      is_walk_in: false,
      is_repeat: is_repeat,
      party_size: get_party_size,
      square_booking_id: params[:square_booking_id].presence || "SB-#{SecureRandom.hex(8)}"
    )
  end
end
