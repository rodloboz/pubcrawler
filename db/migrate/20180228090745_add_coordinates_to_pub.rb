class AddCoordinatesToPub < ActiveRecord::Migration[5.1]
  def change
    add_column :pubs, :latitude, :float
    add_column :pubs, :longitude, :float
  end
end
