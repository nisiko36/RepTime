class Reservation < ApplicationRecord
  belongs_to :customer

  validates :start_at, presence: true
  validates :end_at, presence: true
  validate :start_must_be_before_end

  private

  def start_must_be_before_end
    if start_at.present? && end_at.present? && start_at >= end_at
      errors.add(:start_at, "must be before end time")
    end
  end
end
