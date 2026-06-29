class CreateRvListings < ActiveRecord::Migration[8.1]
  def change
    create_table :rv_listings do |t|
      t.string :title, null: false
      t.text :description, null: false
      t.string :location, null: false
      t.decimal :price_per_day, null: false, precision: 10, scale: 2
      t.references :owner, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
