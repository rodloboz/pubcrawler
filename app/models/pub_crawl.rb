class PubCrawl < ApplicationRecord
  belongs_to :crawl
  belongs_to :pub

  vlaidates :pub, uniqueness: { scope: :crawl }
end
