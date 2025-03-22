class AddLastVisitAtToCustomers < ActiveRecord::Migration[7.1]
  def change
    add_column :customers, :last_visit_at, :datetime
  end
end
