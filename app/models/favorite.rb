class Favorite < ApplicationRecord
  belongs_to :user
  belongs_to :favorited, polymorphic: true

  validates :user_id, uniqueness: { scope: [:favorited, :favorited_id] }
end
