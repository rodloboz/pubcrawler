class Crawl < ApplicationRecord
  has_one :pub_crawl
  has_many :pubs, through: :pub_crawl
end
