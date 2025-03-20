class Deleteownerid < ActiveRecord::Migration[7.2]
  def change
    remove_column :clubs, :owner_id
  end
end
