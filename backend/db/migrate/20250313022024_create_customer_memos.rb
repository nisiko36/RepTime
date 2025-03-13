class CreateCustomerMemos < ActiveRecord::Migration[7.1]
  def change
    create_table :customer_memos do |t|
      t.references :customer, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.text :content
      t.integer :likes_count

      t.timestamps
    end
  end
end
