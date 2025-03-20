class Event < ApplicationRecord
    belongs_to :club, foreign_key: :club_id
end