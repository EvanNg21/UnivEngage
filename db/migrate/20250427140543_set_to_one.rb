class SetToOne < ActiveRecord::Migration[7.2]
  def change
    change_column :clubs, :member_count, :integer, default: 0
  end
end
