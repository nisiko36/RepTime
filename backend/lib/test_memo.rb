# 『予約者 七郎（ID:106）』
puts "顧客『予約者 七郎（ID:106）』のテストメモを登録します..."

customer_id = 106
hall_user_ids = [24, 33, 32, 27, 34, 35, 29, 36, 30]

memo_contents = [
  "会社の同僚とよく来店。部下の『佐藤くん』と2人利用が多い。",
  "仕事終わりに19:00ごろからの予約が多い。",
  "上司っぽく見えるが、割り勘での支払いスタイル（レジで注意）。",
  "焼き鳥盛り合わせ＋瓶ビールスタートが定番。",
  "静かな席（C席やD席）希望されることが多い。仕事の話が多そう。"
]

memo_contents.each do |content|
  CustomerMemo.create!(
    customer_id: customer_id,
    user_id: hall_user_ids.sample,
    content: content,
    is_shared: true
  )
end

puts "予約者 七郎のテストメモ登録が完了しました！（会社員・グループ利用）"
