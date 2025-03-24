class RemoveSeatNumberFromReservations < ActiveRecord::Migration[7.1]
  def change
    remove_column :reservations, :seat_number, :integer
  end
end
