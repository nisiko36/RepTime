require 'net/http'
require 'uri'
require 'json'
require 'dotenv/load'

ACCESS_TOKEN = ENV['FREEE_ACCESS_TOKEN']
COMPANY_ID   = ENV['FREEE_COMPANY_ID']
EMPLOYEE_ID  = "2998659"  # ← 対象のemployee_idに書き換え可

API_BASE = "https://api.freee.co.jp"

def post_time_clock(employee_id:, clock_type:, datetime:, note: "")
  uri = URI("#{API_BASE}/hr/api/v1/employees/#{employee_id}/time_clocks")

  req = Net::HTTP::Post.new(uri)
  req['Authorization'] = "Bearer #{ACCESS_TOKEN}"
  req['Content-Type']  = 'application/json'

  req.body = {
    company_id: COMPANY_ID,
    type: clock_type,
    datetime: datetime,
    note: note
  }.to_json

  res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
    http.request(req)
  end

  puts "▼ #{clock_type.upcase} 打刻レスポンス ▼"
  puts "Status: #{res.code}"
  puts "Body  : #{res.body}"
  puts "-" * 40
end

# ===== 実行 =====

# 出勤（17:00）
# post_time_clock(
#   employee_id: EMPLOYEE_ID,
#   clock_type: "clock_in",
#   datetime: "2025-02-01 17:00",
#   note: "テスト出勤"
# )

# 退勤（21:00）
post_time_clock(
  employee_id: EMPLOYEE_ID,
  clock_type: "clock_out",
  datetime: "2025-02-01 23:59",
  note: ""
)
