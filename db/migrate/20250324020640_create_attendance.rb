class CreateAttendance < ActiveRecord::Migration[7.2]
  def change
    create_table :event_attendances do |t|
      t.references :event, null:false, foreign_key: {to_table: :events, primary_key: :event_id}
      t.references :user, null:false, foreign_key: {to_table: :users, primary_key: :user_id}

      t.timestamps
    end
    add_index :event_attendances, [:event_id, :user_id], unique: true
  end
end
