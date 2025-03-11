class User < ApplicationRecord
    self.primary_key = :user_id
    has_secure_password
    has_many :club_members
    has_many :clubs, through: :club_members

    has_many :owned_clubs, class_name: 'Club', foreign_key: 'owner_id'
end
