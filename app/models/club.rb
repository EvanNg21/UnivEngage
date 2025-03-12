class Club < ApplicationRecord
    has_many :club_members
    has_many :members, through: :club_members, source: :user
    has_many :events
    
    belongs_to :owner, class_name: 'User', foreign_key: 'owner_id'

    def add_admin(user)
        club_members.create(user: user, role: 'admin')
    end
    
    def admin?(user)
        club_members.exists?(user: user, role: 'admin')
    end
end 