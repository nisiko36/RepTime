# lib/scripts/seed_shifts_from_json.rb
require 'json'
require 'date'

# 2月
# json_path = "shift_schedule_2025_02.json"

# 3月
# json_path = "shift_schedule_2025_03.json"

parsed = JSON.parse(File.read(json_path))

count = 0

parsed.each do |date, shifts|
  shifts.each do |entry|
    Shift.create!(
      user_id: entry["user_id"],
      check_in: entry["check_in"],
      check_out: entry["check_out"],
      break_begin: entry.dig("breaks", 0, "begin"),
      break_end:   entry.dig("breaks", 0, "end")
    )
    puts "Shift created: #{entry["name"]} (#{date})"
    count += 1
  rescue => e
    puts "Error for #{entry["name"]} (#{date}): #{e.message}"
  end
end

puts "----"
puts "登録完了: #{count}件のシフトが追加されました。"
