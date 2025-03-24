class AddPartySizeToReservations < ActiveRecord::Migration[7.1]
  def change
    add_column :reservations, :party_size, :integer
  end
end
