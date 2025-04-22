class Changelikedby < ActiveRecord::Migration[7.2]
  def change
    change_column :posts, :liked_by, :integer
  end
end
