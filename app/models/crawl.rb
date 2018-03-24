class Crawl < ApplicationRecord
  has_many :pub_crawls
  has_many :pubs, through: :pub_crawls
end
