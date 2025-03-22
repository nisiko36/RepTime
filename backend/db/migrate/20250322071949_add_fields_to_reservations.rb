class AddFieldsToReservations < ActiveRecord::Migration[7.1]
  def change
    add_column :reservations, :seat_numbers, :string, array: true, default: []
    add_column :reservations, :is_walk_in, :boolean, default: false
    add_column :reservations, :square_booking_id, :string
  end
end
