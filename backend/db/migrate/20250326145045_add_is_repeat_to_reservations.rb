class AddIsRepeatToReservations < ActiveRecord::Migration[7.1]
  def change
    add_column :reservations, :is_repeat, :boolean
  end
end
