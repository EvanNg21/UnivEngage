class ClubMember < ApplicationRecord
    belongs_to :user
    belongs_to :club, counter_cache: :member_count

    ROLES = ['member', 'admin']

    validates :role, inclusion: { in: ROLES }
end