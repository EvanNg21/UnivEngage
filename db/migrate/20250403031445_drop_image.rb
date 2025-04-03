class DropImage < ActiveRecord::Migration[7.2]
  def change
    remove_column :posts, :image
  end
end
