class Dropposts < ActiveRecord::Migration[7.2]
  def change
    drop_table :posts
  end
end
