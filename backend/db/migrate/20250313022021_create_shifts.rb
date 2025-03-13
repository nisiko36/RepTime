class CreateShifts < ActiveRecord::Migration[7.1]
  def change
    create_table :shifts do |t|
      t.references :user, null: false, foreign_key: true
      t.datetime :check_in
      t.datetime :check_out
      t.json :breaks

      t.timestamps
    end
  end
end
