class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  has_many :favorites
  has_many :favorite_pubs, through: :favorites, source: :favorited, source_type: 'Pub'
  has_many :favorite_crawls, through: :favorites, source: :favorited, source_type: 'Crawl'

  def likes_pub?(pub)
    favorite_pubs.any? { |p| p.id == pub.id }
  end

  def likes_crawl?(crawl)
    favorite_crawls.any? { |c| c.id == crawl.id }
  end
end
