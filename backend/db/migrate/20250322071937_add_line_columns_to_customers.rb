class AddLineColumnsToCustomers < ActiveRecord::Migration[7.1]
  def change
    add_column :customers, :line_user_id, :string
    add_column :customers, :line_display_name, :string
  end
end
