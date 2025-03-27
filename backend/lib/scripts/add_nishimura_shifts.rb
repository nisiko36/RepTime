# lib/scripts/add_nishimura_shifts.rb
require 'json'
require 'date'

NISHIMURA_USER_ID = 23
NISHIMURA_NAME = "西村 太郎"
NISHIMURA_EMP_ID = 2992693

# JSON_PATH = "shift_schedule_2025_02.json"
JSON_PATH = "shift_schedule_2025_03.json"

# 月曜日（定休日）以外の 2月全日を対象にする
def target_dates(year:, month:)
  (Date.new(year, month, 1)..Date.new(year, month, -1)).reject { |d| d.monday? }
end

def build_shift_entry(date)
  {
    "user_id" => NISHIMURA_USER_ID,
    "name" => NISHIMURA_NAME,
    "freee_employee_id" => NISHIMURA_EMP_ID,
    "shift_type" => "full",
    "check_in" => "#{date} 17:00",
    "check_out" => "#{date} 23:45",
    "breaks" => [
      {
        "begin" => "#{date} 21:00",
        "end" => "#{date} 22:00"
      }
    ]
  }
end

# ========== メイン処理 ==========
parsed = JSON.parse(File.read(JSON_PATH))

target_dates(year: 2025, month: 3).each do |date|
  date_str = date.strftime("%Y-%m-%d")

  parsed[date_str] ||= []
  parsed[date_str] << build_shift_entry(date_str)
end

# 保存
File.write(JSON_PATH, JSON.pretty_generate(parsed))
puts "西村太郎のシフトを追加しました！"
