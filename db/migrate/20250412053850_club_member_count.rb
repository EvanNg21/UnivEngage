class ClubMemberCount < ActiveRecord::Migration[7.2]
  def change
    add_column :clubs, :member_count, :integer, default: 1
  end
end
