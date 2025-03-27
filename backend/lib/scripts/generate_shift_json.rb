require 'json'
require 'date'

# 従業員リスト（ID, 名前, freee_employee_id）
employees = [
  { id: 24, name: "従業員 太郎", freee_id: 2998659 },
  { id: 33, name: "従業員 愛瑠", freee_id: 3066322 },
  { id: 23, name: "西村 太郎", freee_id: 2992693 },  # オーナー（除外対象）
  { id: 28, name: "従業員 智", freee_id: 3066303 },
  { id: 30, name: "従業員 翔", freee_id: 3066299 },
  { id: 31, name: "従業員 和也", freee_id: 3066300 },
  { id: 32, name: "従業員 潤", freee_id: 3066306 },
  { id: 27, name: "従業員 雅紀", freee_id: 3066304 },
  { id: 34, name: "従業員 芽郁", freee_id: 3066314 },
  { id: 35, name: "従業員 美桜", freee_id: 3066315 },
  { id: 29, name: "従業員 架純", freee_id: 3066316 },
  { id: 36, name: "従業員 美波", freee_id: 3066318 },
  { id: 37, name: "従業員 三郎", freee_id: 2998711 },
  { id: 26, name: "従業員 次郎", freee_id: 2998697 },
  { id: 25, name: "従業員 花子", freee_id: 2998684 }
]

# オーナーは除外してグループ分け
kitchen_group = employees.select { |e| ["従業員 智", "従業員 三郎", "従業員 次郎", "従業員 花子", "従業員 和也"].include?(e[:name]) }
hall_group = employees.select { |e| ["従業員 太郎", "従業員 愛瑠", "従業員 潤", "従業員 雅紀", "従業員 芽郁", "従業員 美桜", "従業員 架純", "従業員 美波", "従業員 翔"].include?(e[:name]) }

start_date = Date.new(2025, 2, 1)
end_date   = Date.new(2025, 2, 28)

# シフトパターン
weekday_kitchen_patterns = ["full", "first_half"]
weekday_hall_patterns = ["full", "first_half", "second_half"]
weekend_kitchen_patterns = ["full", "first_half", "second_half"]
weekend_hall_patterns = ["full", "first_half", "second_half"]

# シフト時間定義（24:00 → 23:45 に修正）
def shift_times(shift_type, date)
  date_str = date.strftime("%Y-%m-%d")
  case shift_type
  when "first_half"
    { check_in: "#{date_str} 17:00", check_out: "#{date_str} 21:00", breaks: [] }
  when "second_half"
    { check_in: "#{date_str} 20:00", check_out: "#{date_str} 23:45", breaks: [] }
  when "full"
    { check_in: "#{date_str} 17:00", check_out: "#{date_str} 23:45", breaks: [{ "begin" => "#{date_str} 20:00", "end" => "#{date_str} 21:00" }] }
  else
    {}
  end
end

schedule = {}

(start_date..end_date).each do |day|
  next if day.monday?

  is_weekend = (day.wday == 0 || day.wday == 5 || day.wday == 6)

  if is_weekend
    req_kitchen = 2
    req_hall = 4
    kitchen_patterns = weekend_kitchen_patterns
    hall_patterns = weekend_hall_patterns
  else
    req_kitchen = 1
    req_hall = 3
    kitchen_patterns = weekday_kitchen_patterns
    hall_patterns = weekday_hall_patterns
  end

  srand(day.to_time.to_i)

  kitchen_assignments = Array.new(req_kitchen) { kitchen_patterns.sample }
  hall_assignments = Array.new(req_hall) { hall_patterns.sample }

  chosen_kitchen = kitchen_group.sample(req_kitchen)
  chosen_hall = hall_group.sample(req_hall)

  day_schedule = []

  kitchen_assignments.each_with_index do |stype, idx|
    times = shift_times(stype, day)
    emp = chosen_kitchen[idx]
    day_schedule << {
      user_id: emp[:id],
      name: emp[:name],
      freee_employee_id: emp[:freee_id],
      shift_type: stype,
      check_in: times[:check_in],
      check_out: times[:check_out],
      breaks: times[:breaks]
    }
  end

  hall_assignments.each_with_index do |stype, idx|
    times = shift_times(stype, day)
    emp = chosen_hall[idx]
    day_schedule << {
      user_id: emp[:id],
      name: emp[:name],
      freee_employee_id: emp[:freee_id],
      shift_type: stype,
      check_in: times[:check_in],
      check_out: times[:check_out],
      breaks: times[:breaks]
    }
  end

  schedule[day.strftime("%Y-%m-%d")] = day_schedule
end

File.open("shift_schedule_2025_02.json", "w") do |f|
  f.write(JSON.pretty_generate(schedule))
end

puts "✅ Shift schedule generated and saved to shift_schedule_2025_02.json"
