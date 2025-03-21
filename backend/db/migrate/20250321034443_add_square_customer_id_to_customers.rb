class AddSquareCustomerIdToCustomers < ActiveRecord::Migration[7.1]
  def change
    add_column :customers, :square_customer_id, :string
  end
end
