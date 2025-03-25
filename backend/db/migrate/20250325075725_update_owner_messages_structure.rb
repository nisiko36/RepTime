class UpdateOwnerMessagesStructure < ActiveRecord::Migration[7.1]
  def change
    remove_column :owner_messages, :pinned, :boolean
    add_column :owner_messages, :posted_on, :date
  end
end
