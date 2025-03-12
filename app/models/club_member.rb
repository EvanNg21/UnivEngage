class ClubMember < ApplicationRecord
    belongs_to :user
    belongs_to :club

    ROLES = ['member', 'admin']

    validates :role, inclusion: { in: ROLES }
end