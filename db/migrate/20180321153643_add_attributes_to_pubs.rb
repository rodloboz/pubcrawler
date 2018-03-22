class AddAttributesToPubs < ActiveRecord::Migration[5.1]
  def change
    add_column :pubs, :description, :string
    add_column :pubs, :photo, :string
  end
end
