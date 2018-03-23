class AddDatesToCrawls < ActiveRecord::Migration[5.1]
  def change
    add_column :crawls, :start_date, :date
    add_column :crawls, :end_date, :date
  end
end
