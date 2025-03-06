class RemakeUsers < ActiveRecord::Migration[7.2]
  def change
    create_table :users, primary_key: :user_id do |t|
      t.string :email
      t.string :password
      t.string :first_name
      t.string :last_name
      t.text :bio
      t.date :date_of_birth
      t.string :profile_picture

      t.timestamps
    end
  end
end
