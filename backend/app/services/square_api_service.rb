require 'faraday'
require 'json'

class SquareApiService
  SQUARE_BASE_URL = "https://connect.squareupsandbox.com/";

  def initialize
    @access_token = ENV["SQUARE_ACCESS_TOKEN"]&.strip || raise("SQUARE_ACCESS_TOKEN が設定されていません")
    @api_version = ENV["SQUARE_API_VERSION"]&.strip || "2025-01-23"

    @conn = Faraday.new(url: SQUARE_BASE_URL) do |faraday|
      faraday.request :json
      faraday.response :json
      faraday.adapter Faraday.default_adapter
    end
  end

  # 🔹 予約情報を取得
  def fetch_bookings
    start_at_min = "2025-03-21T00:00:00+09:00"
    start_at_max = "2025-03-21T23:59:59+09:00"

    query_params = {
      start_at_min: start_at_min,
      start_at_max: start_at_max
    }

    response = @conn.get("/v2/bookings", query_params, headers)

    # puts "✅ APIレスポンス: #{response.inspect}"
    # puts "🔍 ステータス: #{response.status}"
    # puts "🔍 ヘッダー: #{response.headers.inspect}"
    # puts "🔍 ボディ: #{response.body.inspect}"

    handle_response(response)
  end

  private

  def headers
    puts "@@@@@@ Square API リクエスト時のアクセストークン: #{@access_token.inspect}"
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
      error_message = response.body.is_a?(Hash) ? response.body["message"] : JSON.parse(response.body)["message"] rescue "APIリクエスト失敗"
      { error: error_message, status: response.status }
    end
  end
end
