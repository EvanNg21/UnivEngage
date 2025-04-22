class PostLikes < ActiveRecord::Migration[7.2]
  def change
    create_table :post_likes do |t|
      t.references :post, null:false, foreign_key: {to_table: :posts, primary_key: :post_id}
      t.references :user, null:false, foreign_key: {to_table: :users, primary_key: :user_id}

      t.timestamps
    end
    add_index :post_likes, [:post_id, :user_id], unique: true
  end
end
