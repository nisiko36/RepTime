# lib/scripts/adjust_shift_times.rb
require 'json'
require 'time'

JSON_PATH = "shift_schedule_2025_02.json"

def convert_24_to_2345(datetime_str)
  if datetime_str.include?("24:00")
    date = Date.parse(datetime_str.split(" ")[0])
    return "#{date.strftime('%Y-%m-%d')} 23:45"
  end
  datetime_str
end

# JSONを読み込み
parsed = JSON.parse(File.read(JSON_PATH))

# 日付ごとの配列に対して処理
parsed.each do |date, shifts|
  shifts.each do |shift|
    # check_out の変換
    shift["check_out"] = convert_24_to_2345(shift["check_out"]) if shift["check_out"]

    # breaks の end の変換
    if shift["breaks"].is_a?(Array)
      shift["breaks"].each do |b|
        b["end"] = convert_24_to_2345(b["end"]) if b["end"]
      end
    end
  end
end

# JSONに上書き保存
File.write(JSON_PATH, JSON.pretty_generate(parsed))
puts "✅ 変換完了: #{JSON_PATH} に上書きしました。"
