# lib/scripts/register_nishimura_shifts_march.rb
require 'net/http'
require 'uri'
require 'json'
require 'dotenv/load'
require 'date'

ACCESS_TOKEN = ENV['FREEE_ACCESS_TOKEN']
COMPANY_ID   = ENV['FREEE_COMPANY_ID']
API_BASE     = "https://api.freee.co.jp"

EMPLOYEE_ID  = 2992693  # 西村 太郎
USER_NAME    = "西村 太郎"

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

  res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http| http.request(req) }

  puts "[#{clock_type}] #{datetime} (#{USER_NAME}) → #{res.code}"
  puts "Body: #{res.body}" if res.code != "201"
  puts "-" * 40
end

# ================================
# 実行処理：2025年3月の月曜以外に出勤
# ================================
(1..31).each do |day|
  date = Date.new(2025, 3, day)
  next if date.monday?

  date_str = date.strftime("%Y-%m-%d")

  post_time_clock(
    employee_id: EMPLOYEE_ID,
    clock_type: "clock_in",
    datetime: "#{date_str} 17:00",
    note: "自動: 出勤"
  )

  post_time_clock(
    employee_id: EMPLOYEE_ID,
    clock_type: "break_begin",
    datetime: "#{date_str} 21:00",
    note: "自動: 休憩開始"
  )

  post_time_clock(
    employee_id: EMPLOYEE_ID,
    clock_type: "break_end",
    datetime: "#{date_str} 22:00",
    note: "自動: 休憩終了"
  )

  post_time_clock(
    employee_id: EMPLOYEE_ID,
    clock_type: "clock_out",
    datetime: "#{date_str} 23:45",
    note: "自動: 退勤"
  )
end

