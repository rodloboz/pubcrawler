class PubCrawl < ApplicationRecord
  belongs_to :crawl
  belongs_to :pub

  validates :pub, uniqueness: { scope: :crawl }
end
