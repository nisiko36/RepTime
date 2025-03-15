class Shift < ApplicationRecord
  belongs_to :user

  validates :check_in, presence: true
  validates :check_out, presence: true
  validate :check_in_must_be_before_check_out

  private

  def check_in_must_be_before_check_out
    if check_in.present? && check_out.present? && check_in >= check_out
      errors.add(:check_in, "must be before check-out time")
    end
  end
end
