class LikedBy < ActiveRecord::Migration[7.2]
  def change
    add_column :posts, :liked_by, :string
    
  end
end
