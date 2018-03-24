class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  has_many :favorites
  has_many :favorite_pubs, through: :favorites, source: :favorited, source_type: 'Pub'

  def likes_pub?(pub)
    favorite_pubs.any? { |p| p.id == pub.id }
  end

  def likes_crawl?(crawl)
    nil
  end
end
