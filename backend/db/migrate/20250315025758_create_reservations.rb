class CreateReservations < ActiveRecord::Migration[7.1]
  def change
    create_table :reservations do |t|
      t.references :customer, null: false, foreign_key: true
      t.datetime :start_at
      t.datetime :end_at
      t.integer :seat_number

      t.timestamps
    end
  end
end
