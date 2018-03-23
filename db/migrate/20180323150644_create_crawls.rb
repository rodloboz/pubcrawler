class CreateCrawls < ActiveRecord::Migration[5.1]
  def change
    create_table :crawls do |t|
      t.string :name
      t.string :city
      t.text :description

      t.timestamps
    end
  end
end
