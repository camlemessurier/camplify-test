# Lampify

A two-sided marketplace API and frontend connecting RV owners (lessors) with renters (hirers).

## Stack

- **API**: Ruby on Rails 8, API mode, PostgreSQL
- **Auth**: `has_secure_password` + opaque Bearer token
- **Tests**: RSpec + FactoryBot + Shoulda Matchers + Rswag
- **Docs**: Swagger UI at `/api-docs`
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS

---

## Quick Start with Docker

```bash
# Start everything (PostgreSQL + Rails API + Next.js)
docker compose up --build

# API:      http://localhost:7777
# Frontend: http://localhost:8888
# API Docs: http://localhost:7777/api-docs
```

---

## Manual Setup

### API

```bash
cd camplify-rv-api
bundle install

# Start a PostgreSQL instance (Docker recommended)
docker run -d --name rv-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=postgres -p 5432:5432 postgres:16-alpine

# Configure config/database.yml with your connection details, then:
rails db:create db:migrate db:seed

rails server -p 7777
```

### Frontend

```bash
cd frontend
npm install
npm run dev   # http://localhost:8888
```

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/register` | — | Register a new user |
| POST | `/api/v1/auth/login` | — | Login, returns token |
| DELETE | `/api/v1/auth/logout` | ✓ | Logout, invalidates token |
| GET | `/api/v1/listings` | — | List all RV listings |
| GET | `/api/v1/listings/:id` | — | Get a single listing |
| POST | `/api/v1/listings` | ✓ | Create a listing |
| PATCH | `/api/v1/listings/:id` | ✓ owner | Update a listing |
| DELETE | `/api/v1/listings/:id` | ✓ owner | Delete a listing |
| POST | `/api/v1/listings/:listing_id/bookings` | ✓ | Create a booking request |
| GET | `/api/v1/bookings/as_hirer` | ✓ | My bookings as hirer |
| GET | `/api/v1/bookings/as_owner` | ✓ | Bookings on my listings |
| PATCH | `/api/v1/bookings/:id/confirm` | ✓ owner | Confirm a booking |
| PATCH | `/api/v1/bookings/:id/reject` | ✓ owner | Reject a booking |
| GET | `/api/v1/listings/:listing_id/messages` | ✓ | List messages |
| POST | `/api/v1/listings/:listing_id/messages` | ✓ | Send a message |

---

## Example curl Commands

### Register
```bash
curl -X POST http://localhost:7777/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:7777/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner1@example.com","password":"password123"}'
```

### Create a Listing
```bash
curl -X POST http://localhost:7777/api/v1/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Byron Bay Camper","description":"Cozy van for the coast","location":"Byron Bay, NSW","price_per_day":150}'
```

### Create a Booking
```bash
curl -X POST http://localhost:7777/api/v1/listings/1/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <hirer_token>" \
  -d '{"start_date":"2026-08-01","end_date":"2026-08-07"}'
```

### Send a Message
```bash
curl -X POST http://localhost:7777/api/v1/listings/1/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"content":"Is the RV pet-friendly?"}'
```

---

## Tests

```bash
cd camplify-rv-api
bundle exec rspec              # Run all 69 specs
bundle exec rake rswag:specs:swaggerize RAILS_ENV=test   # Regenerate swagger.yaml
```

## Seed Data

Three users are pre-seeded:
- `owner1@example.com` / `password123` — owns 2 listings
- `owner2@example.com` / `password123` — owns 2 listings
- `hirer1@example.com` / `password123` — has 2 bookings
