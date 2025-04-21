class Post < ApplicationRecord
    belongs_to :club, foreign_key: :club_id, touch: true
    belongs_to :user, foreign_key: :user_id
    has_one_attached :post_image
end
