class CreateTodos < ActiveRecord::Migration
  def change
    create_table :todos do |t|
      t.string :title
      t.integer :user_id
      t.datetime :due_on

      t.datetime :finished_at
      t.integer :order

      t.timestamps
    end
  end
end
