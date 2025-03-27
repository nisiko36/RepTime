require 'faraday'
require 'json'

class FreeeApiService
  FREEE_BASE_URL = "https://api.freee.co.jp"

  def initialize
    @access_token = ENV["FREEE_ACCESS_TOKEN"]&.strip || raise("FREEE_ACCESS_TOKEN が設定されていません")
    @company_id = ENV["FREEE_COMPANY_ID"]&.strip || raise("FREEE_COMPANY_ID が設定されていません")

    @conn = Faraday.new(url: FREEE_BASE_URL) do |faraday|
      faraday.request :json  # JSONリクエストの自動処理
      faraday.response :json # JSONレスポンスの自動パース
      faraday.adapter Faraday.default_adapter
    end
  end

  # 🔹 従業員一覧を取得
  def fetch_employees
    # puts "🛑 APIリクエストを送信: #{@company_id}"
    # puts "🛑 使用するトークン: #{@access_token}"
    # puts "🛑 使用するヘッダー: #{headers}"

    response = @conn.get("/hr/api/v1/companies/#{@company_id}/employees", nil, headers)
    puts "✅ APIレスポンス: #{response.inspect}"

    # puts "🛑 APIレスポンス: #{response.status}"
    # puts "🛑 APIレスポンスヘッダー: #{response.headers}"
    # puts "🛑 APIレスポンスボディ: #{response.body.inspect}"

    handle_response(response)
  end

  # 🔹 勤怠打刻を登録
  def post_time_clock(employee_id, clock_type, datetime, note ="")
    formatted_datetime = Time.parse(datetime).strftime("%Y-%m-%d %H:%M")
    # formatted_datetime = Time.parse(datetime).iso8601
    body = {
      company_id: @company_id,
      type: clock_type.to_s.strip,  # "clock_in", "clock_out", "break_begin", "break_end"
      datetime: formatted_datetime,
      note: note.to_s
    }
    puts "送信データ: #{body.inspect}"  # ← デバッグ用に追加
    puts "送信URL: /hr/api/v1/employees/#{employee_id}/time_clocks"

    response = @conn.post("/hr/api/v1/employees/#{employee_id}/time_clocks", body.to_json, headers)

    puts "APIレスポンス: #{response.status}, #{response.body.inspect}"  # ← レスポンスの確認

    handle_response(response)

  end

  private

  def headers
    {
      "Authorization" => "Bearer #{@access_token}",
      "Accept" => "application/json",
      "Content-Type" => "application/json"
    }
  end

  def handle_response(response)
    if response.status == 200 || response.status == 201
      # すでに Faraday が JSON をパースしているので、body が Hash か Array ならそのまま返す
      return response.body if response.body.is_a?(Hash) || response.body.is_a?(Array)

      # もし String の場合は JSON パースを試みる
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
