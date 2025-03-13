class CreateOwnerMessages < ActiveRecord::Migration[7.1]
  def change
    create_table :owner_messages do |t|
      t.references :user, null: false, foreign_key: true
      t.json :messages
      t.boolean :pinned

      t.timestamps
    end
  end
end
