class NewPosts < ActiveRecord::Migration[7.2]
  def change
    create_table :posts, primary_key: :post_id do |t|
      t.string :post_name
      t.text :content, null: false
      t.integer :views_count
      t.integer :likes_count
      t.integer :comments_count
      t.string :image
      t.references :club, null: false, foreign_key: { to_table: :clubs, primary_key: :club_id }
      t.references :user, null: false, foreign_key: { to_table: :users, primary_key: :user_id }

      t.timestamps
    end
  end
end
