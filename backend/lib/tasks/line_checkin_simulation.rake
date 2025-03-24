namespace :line_checkin do
  desc "指定日の予約を自動でLINEチェックイン処理（自動判定: new または test_repeat）"
  task simulate_for_date: :environment do
    require "net/http"
    require "uri"
    require "json"

    # チェックイン対象日を環境変数 TARGET_DATE で指定（指定がなければデフォルト "2025-02-04"）
    target_date = ENV["TARGET_DATE"] || "2025-02-04"
    date = Date.parse(target_date)

    # 対象日の予約を取得（予約はDBに既に登録済みのもの）
    reservations = Reservation.where(start_at: date.beginning_of_day..date.end_of_day).includes(:customer)

    reservations.each do |reservation|
      customer = reservation.customer
      next unless customer

      # 自動判定: 初回チェックインなら visit_count が 0 → new、以降は test_repeat
      mode = customer.visit_count.to_i.zero? ? "new" : "test_repeat"

      # payload の基本情報（どちらのモードでも共通）
      payload = {
        type: mode,
        seat_numbers: reservation.seat_numbers,
        start_at: reservation.start_at.in_time_zone("Asia/Tokyo").iso8601
      }

      # test_repeat モードの場合は、顧客情報（square_customer_id, line_user_id）を付与する
      if mode == "test_repeat"
        payload[:square_customer_id] = customer.square_customer_id
        payload[:line_user_id] = customer.line_user_id
      end

      # 出力準備（エンコーディング対応）
      customer_name = customer.name.to_s.encode("UTF-8", invalid: :replace, undef: :replace)
      seat_str = reservation.seat_numbers.map { |s| s.to_s.encode("UTF-8", invalid: :replace, undef: :replace) }.join(", ")
      time_str = payload[:start_at].to_s.encode("UTF-8")

      puts "チェックイン (#{mode}): #{customer_name} #{time_str} (#{seat_str})"

      uri = URI("http://localhost:3000/line_checkin")
      response = Net::HTTP.post(uri, payload.to_json, { "Content-Type" => "application/json" })

      puts "レスポンス: #{response.body.encode("UTF-8", invalid: :replace, undef: :replace)}"
      puts "-" * 40
    end

    puts "✔️ チェックイン完了 for #{date}"
  end
end
