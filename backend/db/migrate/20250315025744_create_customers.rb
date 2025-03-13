class CreateCustomers < ActiveRecord::Migration[7.1]
  def change
    create_table :customers do |t|
      t.string :name
      t.integer :visit_count

      t.timestamps
    end
  end
end
