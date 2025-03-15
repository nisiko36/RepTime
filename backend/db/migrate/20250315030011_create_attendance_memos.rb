class CreateAttendanceMemos < ActiveRecord::Migration[7.1]
  def change
    create_table :attendance_memos do |t|
      t.references :user, null: false, foreign_key: true
      t.date :date
      t.string :memo_type
      t.text :content

      t.timestamps
    end
  end
end
