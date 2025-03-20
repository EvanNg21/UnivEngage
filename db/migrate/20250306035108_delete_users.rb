class DeleteUsers < ActiveRecord::Migration[7.2]
  def change
    drop_table :users
  end
end
