class SquareApiService
  SQUARE_BASE_URL = "https://connect.squareupsandbox.com/"

  def initialize
    @access_token = ENV["SQUARE_ACCESS_TOKEN"]&.strip || raise("SQUARE_ACCESS_TOKEN が設定されていません")
    @api_version  = ENV["SQUARE_API_VERSION"]&.strip || "2025-01-23"

    @conn = Faraday.new(url: SQUARE_BASE_URL) do |faraday|
      faraday.request :json
      faraday.response :json
      faraday.adapter Faraday.default_adapter
    end
  end

  # 1) Square顧客を作成
  # 公式Doc: POST /v2/customers
  def create_customer(given_name:, email:, phone:)
    body = {
      given_name: given_name,
      email_address: email,
      phone_number: phone
    }
    
    response = @conn.post("/v2/customers", body.to_json, headers)
    parsed = handle_response(response)

    if parsed[:error]
      return parsed
    end

    # 成功時: parsed["customer"] が返る
    {
      customer_id: parsed.dig("customer", "id"),
      status: "created"
    }
  end

  # # 2) Square予約作成
  # # 公式Doc: POST /v2/bookings
  # def create_booking(square_customer_id:, start_at:, end_at:)
  #   body = {
  #     customer_id: square_customer_id,
  #     start_at: start_at.iso8601,
  #     # ... location_id, services, etc. 省略
  #     appointment_segments: [
  #       {
  #         duration_minutes: ((end_at - start_at)/60).to_i, # 予約時間を分に換算
  #         service_variation_id: "SVC-xxxx", # 仮
  #         team_member_id: "TMEM-xxxx",     # 仮
  #       }
  #     ]
  #   }

  #   response = @conn.post("/v2/bookings", body.to_json, headers)
  #   parsed   = handle_response(response)

  #   if parsed[:error]
  #     return parsed
  #   end

  #   {
  #     booking_id: parsed.dig("booking", "id"),
  #     status: "created"
  #   }
  # end

  # 予約の読み取り
  def fetch_bookings(date)
    # 引数で受け取った日付に基づいて時間範囲を生成
    start_at_min = date.beginning_of_day.iso8601
    start_at_max = date.end_of_day.iso8601

    query_params = {
      start_at_min: start_at_min,
      start_at_max: start_at_max
    }

    response = @conn.get("/v2/bookings", query_params, headers)
    handle_response(response)
  end

  def fetch_customer_name(customer_id)
    return nil unless customer_id.present?

    uri = URI.parse("https://connect.squareupsandbox.com/v2/customers/#{customer_id}")
    request = Net::HTTP::Get.new(uri)
    request["Authorization"] = "Bearer #{ENV['SQUARE_ACCESS_TOKEN']}"
    request["Square-Version"] = "2025-01-23"
    request["Content-Type"] = "application/json"

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end

    json = JSON.parse(response.body)
    if json["customer"]
      [
        json["customer"]["family_name"],
        json["customer"]["given_name"]
      ].compact.join(" ")
    else
      nil
    end
  rescue => e
    Rails.logger.error "Square顧客名取得エラー: #{e.message}"
    nil
  end




  private

  def headers
    {
      "Authorization" => "Bearer #{@access_token}",
      "Square-Version" => @api_version,
      "Content-Type" => "application/json"
    }
  end

  def handle_response(response)
    if response.status == 200 || response.status == 201
      return response.body if response.body.is_a?(Hash) || response.body.is_a?(Array)

      begin
        return JSON.parse(response.body)
      rescue JSON::ParserError => e
        return { error: "JSON パースエラー", details: e.message, status: response.status }
      end
    else
      err_msg = response.body.is_a?(Hash) ? response.body["message"] : JSON.parse(response.body)["message"] rescue "APIリクエスト失敗"
      { error: err_msg, status: response.status }
    end
  end
end
