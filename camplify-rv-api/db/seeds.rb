owner1 = User.find_or_create_by!(email: "owner1@example.com") do |u|
  u.name = "Alice Owner"
  u.password = "password123"
end

owner2 = User.find_or_create_by!(email: "owner2@example.com") do |u|
  u.name = "Bob Owner"
  u.password = "password123"
end

hirer1 = User.find_or_create_by!(email: "hirer1@example.com") do |u|
  u.name = "Charlie Hirer"
  u.password = "password123"
end

listing1 = RvListing.find_or_create_by!(title: "Cozy Campervan - Byron Bay", owner: owner1) do |l|
  l.description = "A beautifully restored 1975 VW campervan with all mod cons. Perfect for exploring the Northern Rivers region."
  l.location = "Byron Bay, NSW"
  l.price_per_day = 150.00
end

listing2 = RvListing.find_or_create_by!(title: "Luxury Motorhome - Great Ocean Road", owner: owner1) do |l|
  l.description = "Spacious 6-berth motorhome with full kitchen, ensuite, and solar panels. Ideal for the iconic Great Ocean Road."
  l.location = "Torquay, VIC"
  l.price_per_day = 280.00
end

listing3 = RvListing.find_or_create_by!(title: "Off-Road 4WD Caravan - Outback", owner: owner2) do |l|
  l.description = "Rugged off-road caravan built for serious adventurers. Full suspension, 200L water tank, and satellite comms."
  l.location = "Alice Springs, NT"
  l.price_per_day = 220.00
end

listing4 = RvListing.find_or_create_by!(title: "Family Pop-Top Caravan - Whitsundays", owner: owner2) do |l|
  l.description = "Light and easy-to-tow pop-top caravan, perfect for families. Includes all linen and kitchen essentials."
  l.location = "Airlie Beach, QLD"
  l.price_per_day = 120.00
end

booking1 = Booking.find_or_create_by!(hirer: hirer1, rv_listing: listing1) do |b|
  b.start_date = Date.today + 7
  b.end_date = Date.today + 14
end

booking2 = Booking.find_or_create_by!(hirer: hirer1, rv_listing: listing3) do |b|
  b.start_date = Date.today + 30
  b.end_date = Date.today + 40
end

Message.find_or_create_by!(user: hirer1, rv_listing: listing1, content: "Hi! Is this available over the Christmas period?")
Message.find_or_create_by!(user: owner1, rv_listing: listing1, content: "Hi Charlie! Yes it is, the dates look great. I've confirmed your booking!")
Message.find_or_create_by!(user: hirer1, rv_listing: listing3, content: "Can the caravan handle the Gibb River Road?")
Message.find_or_create_by!(user: owner2, rv_listing: listing3, content: "Absolutely — it's been to the Kimberley twice. You'll love it.")

puts "Seeded: #{User.count} users, #{RvListing.count} listings, #{Booking.count} bookings, #{Message.count} messages"
