class UpdateShiftsStructure < ActiveRecord::Migration[7.1]
  def change
    remove_column :shifts, :breaks, :json

    # Freee API の構造に合わせて休憩時間
    add_column :shifts, :break_begin, :datetime
    add_column :shifts, :break_end, :datetime
  end
end
