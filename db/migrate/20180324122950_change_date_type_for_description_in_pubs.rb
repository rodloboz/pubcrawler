class ChangeDateTypeForDescriptionInPubs < ActiveRecord::Migration[5.1]
  def self.up
    change_table :pubs do |t|
      t.change :description, :text
    end
  end
  def self.down
    change_table :pubs do |t|
      t.change :description, :string
    end
  end
end
