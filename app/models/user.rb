class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  has_many :favorites
  has_many :favorite_pubs, through: :favorites, source: :favorited, source_type: 'Pub'

  def likes?(pub)
    favorite_pubs.any? { |p| p.id == pub.id }
  end
end
