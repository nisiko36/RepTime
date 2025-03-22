class User < ApplicationRecord
  has_many :shifts, dependent: :destroy
  has_many :shift_requests, dependent: :destroy
  has_many :attendance_memos, dependent: :destroy
  has_many :customer_memos, dependent: :destroy
  has_many :owner_messages, dependent: :destroy

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :role, presence: true, inclusion: { in: ["owner", "staff"] }

  validates :rank_hall, inclusion: { in: [1, 2, 3] }, allow_nil: true
  validates :rank_kitchen, inclusion: { in: [1, 2, 3] }, allow_nil: true

  #freee_employee_id に一意制約
  validates :freee_employee_id, uniqueness: true, allow_nil: true
end
