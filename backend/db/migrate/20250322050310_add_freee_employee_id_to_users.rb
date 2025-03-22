class AddFreeeEmployeeIdToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :freee_employee_id, :integer
  end
end
