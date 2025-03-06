class User < ApplicationRecord
    has_secure_password
    has_many :owned_clubs, class_name: 'Club', foreign_key: 'owner_id'
end
