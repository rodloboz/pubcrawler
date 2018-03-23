class CreatePubCrawls < ActiveRecord::Migration[5.1]
  def change
    create_table :pub_crawls do |t|
      t.references :crawl, foreign_key: true
      t.references :pub, foreign_key: true

      t.timestamps
    end
  end
end
