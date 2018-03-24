class Crawl < ApplicationRecord
  has_many :pub_crawls, dependent: :destroy
  has_many :pubs, through: :pub_crawls
end
