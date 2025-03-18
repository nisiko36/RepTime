User.destroy_all
Shift.destroy_all

user = User.create!(name: "佐藤 太郎", email: "taro@example.com", role: "staff")

Shift.create!(
  user: user,
  check_in: "2025-03-16 09:00:00",
  check_out: "2025-03-16 17:00:00",
  breaks: { lunch: "12:00-13:00" }
)
