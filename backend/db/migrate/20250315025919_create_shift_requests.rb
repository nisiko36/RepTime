class CreateShiftRequests < ActiveRecord::Migration[7.1]
  def change
    create_table :shift_requests do |t|
      t.references :user, null: false, foreign_key: true
      t.date :date
      t.string :shift_type

      t.timestamps
    end
  end
end
