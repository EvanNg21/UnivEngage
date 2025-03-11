class Club < ApplicationRecord
    has_many :club_members
    has_many :members, through: :club_members, source: :user
    
    belongs_to :owner, class_name: 'User', foreign_key: 'owner_id'
end 