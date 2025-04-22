class User < ApplicationRecord
    self.primary_key = :user_id
    has_secure_password
    has_many :club_members
    has_many :clubs, through: :club_members
    has_many :posts, foreign_key: 'user_id'
    has_many :event_attendances
    has_many :post_likes
    has_many :liked_posts, through: :post_likes
    has_many :events, through: :event_attendances, source: :event
    has_one_attached :profile_picture

    has_many :owned_clubs, class_name: 'Club', foreign_key: 'owner_id'

    def admin_of?(club)
        club_members.exists?(club: club, role: 'admin')
    end
end
