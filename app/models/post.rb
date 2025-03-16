class Post < ApplicationRecord
    belongs_to :club, foreign_key: :club_id
    belongs_to :user, foreign_key: :user_id
end
