class ReservationSerializer < ActiveModel::Serializer
  attributes :id, :customer_id, :start_at, :end_at, :seat_numbers, :is_walk_in, :square_booking_id, :party_size
  belongs_to :customer
end
