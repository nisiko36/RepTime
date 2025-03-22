class AddDefaultsToUsers < ActiveRecord::Migration[7.1]
  def change
    change_column_default :users, :rank_hall, 1
    change_column_default :users, :rank_kitchen, 1
  end
end
