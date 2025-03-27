# lib/scripts/register_shifts_from_json.rb
require 'json'
require 'net/http'
require 'uri'
require 'dotenv/load'
require_relative '../../config/environment'  # Rails 環境のロード

ACCESS_TOKEN = ENV['FREEE_ACCESS_TOKEN']
COMPANY_ID   = ENV['FREEE_COMPANY_ID']
API_BASE     = "https://api.freee.co.jp"

# freee API へ打刻するための関数
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
  puts "[#{clock_type}] #{datetime} (emp: #{employee_id}) → #{res.code}"
end

# JSON ファイルからシフトスケジュールを読み込み
# file = File.read("shift_schedule_2025_02.json")
file = File.read("shift_schedule_2025_03.json")

schedule = JSON.parse(file)

# 各日のシフトをループ処理
schedule.each do |date, shifts|
  shifts.each do |shift|
    freee_id = shift["freee_employee_id"]
    check_in = shift["check_in"]
    check_out = shift["check_out"]
    shift_type = shift["shift_type"]
    breaks = shift["breaks"]  # フルシフトの場合のみ中身あり

    # freee API 登録
    if shift_type == "full"
      post_time_clock(employee_id: freee_id, clock_type: "clock_in", datetime: check_in, note: "#{shift_type}_in")
      if breaks.any?
        break_info = breaks.first
        post_time_clock(employee_id: freee_id, clock_type: "break_begin", datetime: break_info["begin"], note: "break_begin")
        post_time_clock(employee_id: freee_id, clock_type: "break_end", datetime: break_info["end"], note: "break_end")
      end
      post_time_clock(employee_id: freee_id, clock_type: "clock_out", datetime: check_out, note: "#{shift_type}_out")
    else
      post_time_clock(employee_id: freee_id, clock_type: "clock_in", datetime: check_in, note: "#{shift_type}_in")
      post_time_clock(employee_id: freee_id, clock_type: "clock_out", datetime: check_out, note: "#{shift_type}_out")
    end

    # DB (shifts テーブル) への保存
    # freee_employee_id から User を検索
    # user = User.find_by(freee_employee_id: freee_id)
    # if user
    #   Shift.create!(
    #     user_id: user.id,
    #     check_in: check_in,
    #     check_out: check_out,
    #     break_begin: entry.dig("breaks", 0, "begin"),
    #     break_end:   entry.dig("breaks", 0, "end")
    #   )
    #   puts "Shift record created for user #{user.name} on #{date}"
    # else
    #   puts "User with freee_employee_id #{freee_id} not found!"
    # end

    sleep(0.2)  # API 過負荷防止
  end
end

puts "All shifts registered from JSON."
