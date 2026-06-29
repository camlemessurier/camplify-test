class CreateBookings < ActiveRecord::Migration[8.1]
  def change
    create_table :bookings do |t|
      t.date :start_date, null: false
      t.date :end_date, null: false
      t.string :status, null: false, default: "pending"
      t.references :user, null: false, foreign_key: true
      t.references :rv_listing, null: false, foreign_key: true

      t.timestamps
    end
  end
end
