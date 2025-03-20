class CreateEvents < ActiveRecord::Migration[7.2]
  def change
    create_table :events, primary_key: :event_id do |t|
      t.string :event_name, null:false
      t.text :description
      t.datetime :event_date, null:false
      t.datetime :start_time
      t.datetime :end_time
      t.string :location
      t.references :club, null: false, foreign_key: { to_table: :clubs, primary_key: :club_id }

      t.timestamps
    end
  end
end
