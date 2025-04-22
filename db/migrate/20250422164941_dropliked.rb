class Dropliked < ActiveRecord::Migration[7.2]
  def change
    remove_column :posts, :likes_count
  end
end
