class CreateClubs < ActiveRecord::Migration[7.2]
  def change
    create_table :clubs, primary_key: :club_id do |t|
      t.string :club_name
      t.string :owner_id
      t.integer :members
      t.text :description

      t.timestamps
    end
  end
end
