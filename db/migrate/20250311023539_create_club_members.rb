class CreateClubMembers < ActiveRecord::Migration[7.2]
  def change
    create_table :club_members do |t|
      t.references :club, null: false, foreign_key: { to_table: :clubs, primary_key: :club_id }
      t.references :user, null: false, foreign_key: { to_table: :users, primary_key: :user_id }
      t.timestamps
    end

    # Add a unique constraint to prevent duplicate memberships
    add_index :club_members, [:club_id, :user_id], unique: true
  end
end
