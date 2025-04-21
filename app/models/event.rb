class Event < ApplicationRecord
    belongs_to :club, foreign_key: :club_id touch: true
    has_many :event_attendances
    has_many :users, through: :event_attendances, source: :user
end