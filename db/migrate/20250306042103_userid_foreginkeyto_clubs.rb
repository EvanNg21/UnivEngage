class UseridForeginkeytoClubs < ActiveRecord::Migration[7.2]
  def change
    add_foreign_key :clubs, :users, column: :owner_id, primary_key: :user_id
  end
end
