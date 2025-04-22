class Changelikes < ActiveRecord::Migration[7.2]
  def change
    change_column :posts, :likes_count, :integer, default: 0
  end
end
