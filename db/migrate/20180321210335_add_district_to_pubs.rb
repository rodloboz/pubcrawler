class AddDistrictToPubs < ActiveRecord::Migration[5.1]
  def change
    add_column :pubs, :district, :string
  end
end
