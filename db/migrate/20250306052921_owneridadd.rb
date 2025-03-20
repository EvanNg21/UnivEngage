class Owneridadd < ActiveRecord::Migration[7.2]
  def change
    add_column :clubs, :owner_id, :string
  end
end
