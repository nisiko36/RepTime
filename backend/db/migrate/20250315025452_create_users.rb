class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :name
      t.string :email
      t.string :role
      t.integer :rank_hall
      t.integer :rank_kitchen
      t.integer :wage_cents
      t.integer :total_earned_cents
      t.json :possible_tasks

      t.timestamps
    end
  end
end
