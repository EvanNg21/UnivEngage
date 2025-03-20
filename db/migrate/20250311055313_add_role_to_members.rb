class AddRoleToMembers < ActiveRecord::Migration[7.2]
  def change
    add_column :club_members, :role, :string, default: 'member'
  end
end
