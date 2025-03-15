class CreateShiftRules < ActiveRecord::Migration[7.1]
  def change
    create_table :shift_rules do |t|
      t.json :rule_content

      t.timestamps
    end
  end
end
