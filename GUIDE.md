# Lampify Codebase Guide

A reference for a Node/Next.js developer reading this Ruby on Rails + Next.js project for the first time.

---

## Table of Contents

1. [Project overview](#1-project-overview)
2. [Repository layout](#2-repository-layout)
3. [The Rails API — concepts for a JS dev](#3-the-rails-api--concepts-for-a-js-dev)
4. [File-by-file: Rails API](#4-file-by-file-rails-api)
5. [File-by-file: Next.js frontend](#5-file-by-file-nextjs-frontend)
6. [How a request flows end-to-end](#6-how-a-request-flows-end-to-end)
7. [Auth system explained](#7-auth-system-explained)
8. [Testing with RSpec and Rswag](#8-testing-with-rspec-and-rswag)
9. [Docker and local dev setup](#9-docker-and-local-dev-setup)
10. [Ruby syntax cheat-sheet for JS devs](#10-ruby-syntax-cheat-sheet-for-js-devs)

---

## 1. Project overview

Lampify is a two-sided RV rental marketplace. Owners list their vans; hirers browse and book them. The project is split into two independent apps:

| App | Tech | Port (local dev) |
|-----|------|-----------------|
| `camplify-rv-api/` | Ruby on Rails 8, API-only mode, PostgreSQL | 3001 |
| `frontend/` | Next.js 15 App Router, TypeScript, Tailwind CSS v4 | 3002 |

They communicate over HTTP: the frontend calls the Rails JSON API. There is no server-side rendering of Rails views — Rails only speaks JSON.

---

## 2. Repository layout

```
camplify-test/
├── camplify-rv-api/          # Rails API
│   ├── app/
│   │   ├── controllers/      # Handle HTTP requests, return JSON
│   │   ├── models/           # ActiveRecord models (DB + business rules)
│   │   └── controllers/concerns/  # Shared controller behaviour (auth)
│   ├── config/
│   │   ├── routes.rb         # URL → controller mapping
│   │   └── database.yml      # DB connection config
│   ├── db/
│   │   ├── migrate/          # Database change scripts (like Knex migrations)
│   │   ├── schema.rb         # Auto-generated snapshot of current DB shape
│   │   └── seeds.rb          # Sample data loader
│   ├── spec/                 # RSpec tests (also generate API docs)
│   │   ├── factories/        # Test data builders (like Factory functions)
│   │   ├── models/           # Unit tests for models
│   │   ├── requests/         # Integration/API tests (also Swagger docs)
│   │   ├── rails_helper.rb   # Test framework config
│   │   └── swagger_helper.rb # OpenAPI schema definitions
│   ├── swagger/v1/swagger.yaml  # Generated API docs
│   ├── Gemfile               # Dependency manifest (like package.json)
│   ├── Gemfile.lock          # Locked versions (like package-lock.json)
│   └── Dockerfile
│
├── frontend/                 # Next.js app
│   ├── app/                  # Next.js App Router pages
│   │   ├── layout.tsx        # Root layout (fonts, Navbar, AuthProvider)
│   │   ├── page.tsx          # Home page
│   │   ├── listings/[id]/    # Listing detail page + sub-components
│   │   ├── auth/login/       # Login page
│   │   ├── auth/register/    # Register page
│   │   └── bookings/         # Bookings dashboard
│   ├── components/           # Shared UI components
│   ├── contexts/             # React context (AuthContext)
│   ├── lib/api.ts            # All API calls in one place
│   ├── types/index.ts        # TypeScript interfaces
│   └── package.json
│
└── docker-compose.yml        # Runs db + api + frontend together
```

---

## 3. The Rails API — concepts for a JS dev

### Rails vs Express

If you've used Express, think of Rails as an opinionated Express with a lot built in. The key difference: Rails follows **convention over configuration** — if you name things the right way, Rails wires them up automatically.

| Express world | Rails equivalent |
|---------------|-----------------|
| `express()` app | `Rails.application` |
| `router.get('/users', handler)` | entry in `routes.rb` |
| Route handler function | Controller action (a method on a class) |
| Knex / Prisma models | ActiveRecord models |
| `package.json` | `Gemfile` |
| `npm install` | `bundle install` |
| `node index.js` | `rails server` |
| `npm test` | `bundle exec rspec` |
| `.env` | `config/credentials.yml.enc` or env vars |
| `node_modules/` | gems (installed globally or in `vendor/bundle`) |

### ActiveRecord: the ORM

Rails bundles its own ORM called **ActiveRecord**. A model is a Ruby class that maps to a database table. You never write SQL for common operations.

```ruby
# In JS you might write:
# const user = await db.query('SELECT * FROM users WHERE id = $1', [1])

# In Rails:
user = User.find(1)              # SELECT * FROM users WHERE id = 1
User.where(email: 'a@b.com')    # SELECT * FROM users WHERE email = 'a@b.com'
User.all                         # SELECT * FROM users
listing.bookings                 # SELECT * FROM bookings WHERE rv_listing_id = listing.id
```

### Conventions Rails uses

- A model named `User` maps to a table named `users` (plural, snake_case)
- A model named `RvListing` maps to a table named `rv_listings`
- A primary key column is always `id` by default
- Foreign keys are `{model_name}_id` by default (e.g. `user_id`, `rv_listing_id`)
- Every table gets `created_at` and `updated_at` for free (Rails manages them)
- A controller named `ListingsController` lives at `app/controllers/listings_controller.rb`
- A method named `index` handles `GET /listings`; `show` handles `GET /listings/:id`; `create` handles `POST /listings`; etc.

### Migrations

Migrations are Ruby scripts that describe schema changes — like Knex migrations. You never edit `schema.rb` directly; you create a new migration, run it, and Rails updates `schema.rb` automatically.

```bash
rails generate migration AddTokenToUsers token:string
rails db:migrate
```

The generated `schema.rb` is a full snapshot of the current schema. It's the source of truth, committed to git.

---

## 4. File-by-file: Rails API

### `Gemfile`

The Ruby equivalent of `package.json`. Declares gem dependencies. Key gems:

| Gem | Purpose |
|-----|---------|
| `rails ~> 8.1` | The framework |
| `pg` | PostgreSQL adapter |
| `puma` | Web server (like http-server or fastify built-in) |
| `bcrypt` | Password hashing — used by `has_secure_password` |
| `rack-cors` | CORS middleware so the Next.js frontend can call this API |
| `rswag-api` / `rswag-ui` | Serves the Swagger UI at `/api-docs` |
| `rspec-rails` | Test framework (like Jest for Ruby) |
| `factory_bot_rails` | Test data factories (like `@faker-js/faker` + factory pattern) |
| `shoulda-matchers` | One-liner model validation assertions |
| `database_cleaner-active_record` | Wraps each test in a transaction and rolls it back |
| `rswag-specs` | Makes RSpec tests also generate `swagger.yaml` |

Run `bundle install` (equivalent to `npm install`) to install all gems.

---

### `config/routes.rb`

Maps URLs to controller actions. The Node.js equivalent is your Express router.

```ruby
Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'   # Swagger UI
  mount Rswag::Api::Engine => '/api-docs'  # Serves swagger.yaml

  namespace :api do
    namespace :v1 do
      post   'auth/register', to: 'auth#register'   # POST /api/v1/auth/register → AuthController#register
      post   'auth/login',    to: 'auth#login'
      delete 'auth/logout',   to: 'auth#logout'

      resources :listings do                    # Generates all CRUD routes for listings
        resources :bookings, only: [:create]    # POST /api/v1/listings/:listing_id/bookings
        resources :messages, only: [:index, :create]
      end

      resources :bookings, only: [] do          # No default CRUD routes
        collection do
          get :as_hirer    # GET /api/v1/bookings/as_hirer
          get :as_owner    # GET /api/v1/bookings/as_owner
        end
        member do
          patch :confirm   # PATCH /api/v1/bookings/:id/confirm
          patch :reject    # PATCH /api/v1/bookings/:id/reject
        end
      end
    end
  end
end
```

`resources :listings` automatically creates these routes:

| Method | Path | Controller action |
|--------|------|------------------|
| GET | `/api/v1/listings` | `listings#index` |
| POST | `/api/v1/listings` | `listings#create` |
| GET | `/api/v1/listings/:id` | `listings#show` |
| PATCH | `/api/v1/listings/:id` | `listings#update` |
| DELETE | `/api/v1/listings/:id` | `listings#destroy` |

---

### `db/schema.rb`

Auto-generated snapshot of the database schema. Read this to understand the data model — don't edit it directly.

```
users           id, name, email, password_digest, token
rv_listings     id, title, description, location, price_per_day, owner_id (FK→users)
bookings        id, start_date, end_date, status, user_id (FK→users), rv_listing_id (FK→rv_listings)
messages        id, content, user_id (FK→users), rv_listing_id (FK→rv_listings)
```

Note: `password_digest` is the bcrypt hash. Rails stores it under that name when you use `has_secure_password`. You never see the raw password in the DB.

---

### `app/models/user.rb`

```ruby
class User < ApplicationRecord   # ApplicationRecord inherits from ActiveRecord::Base
  has_secure_password             # Adds authenticate(), password=, password_digest — powered by bcrypt
                                  # JS equivalent: manually hashing with bcrypt.hash/compare

  has_many :rv_listings, foreign_key: :owner_id   # One user can own many listings
  has_many :bookings, foreign_key: :user_id        # One user can make many bookings
  has_many :messages

  validates :name, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 8 }, allow_nil: true  # nil allowed for updates without changing password

  before_create :generate_token   # Lifecycle hook — runs before INSERT (like Mongoose pre-save)

  def generate_token
    self.token = SecureRandom.hex(32)  # 64-character random hex string
  end

  def regenerate_token!    # Called on login — rotates the token
    update!(token: SecureRandom.hex(32))
  end

  def invalidate_token!    # Called on logout — sets token to nil
    update!(token: nil)
  end
end
```

The `!` suffix on method names (`update!`, `save!`) means "raise an exception if this fails" — as opposed to the non-bang version which returns `false`. This is a Ruby convention, not special syntax.

---

### `app/models/rv_listing.rb`

```ruby
class RvListing < ApplicationRecord
  belongs_to :owner, class_name: "User"   # Custom name: DB column is owner_id, but we call it "owner"
  has_many :bookings, dependent: :destroy  # When listing deleted, bookings cascade-delete
  has_many :messages, dependent: :destroy

  validates :title, :description, :location, presence: true
  validates :price_per_day, numericality: { greater_than: 0 }
end
```

---

### `app/models/booking.rb`

```ruby
class Booking < ApplicationRecord
  belongs_to :hirer, class_name: "User", foreign_key: :user_id  # Column is user_id, alias is hirer
  belongs_to :rv_listing

  STATUSES = %w[pending confirmed rejected].freeze   # %w[] is a Ruby array-of-strings literal

  validates :start_date, :end_date, presence: true
  validates :status, inclusion: { in: STATUSES }
  validate :end_date_after_start_date   # Custom validation method
  validate :hirer_is_not_owner          # Business rule: can't book your own listing

  private

  def end_date_after_start_date
    return unless start_date && end_date           # Early return if either is nil
    errors.add(:end_date, "must be after start date") if end_date <= start_date
  end

  def hirer_is_not_owner
    return unless hirer && rv_listing
    errors.add(:base, "You cannot book your own listing") if user_id == rv_listing.owner_id
  end
end
```

`errors.add` appends to the model's error collection. If any `validate` method adds errors, `save`/`create` returns false (and `save!`/`create!` raises `ActiveRecord::RecordInvalid`).

---

### `app/controllers/concerns/authenticatable.rb`

A **Concern** is a Ruby module mixed into a class to share behaviour — like a mixin or a middleware in JS. This one extracts Bearer token auth so any controller can use it.

```ruby
module Authenticatable
  extend ActiveSupport::Concern   # Makes `included` block work properly

  included do
    attr_reader :current_user     # Exposes @current_user as a readable attribute on the controller
  end

  def authenticate_user!
    token = extract_token                              # Read from Authorization header
    @current_user = User.find_by(token: token) if token  # find_by returns nil if not found (no exception)
    render json: { error: "Unauthorized" }, status: :unauthorized unless @current_user
    # `render` + `return` not needed — Rails stops the action if render was called before it ran
  end

  private

  def extract_token
    header = request.headers["Authorization"]
    header&.split(" ")&.last   # &. is Ruby's safe-navigation operator — like optional chaining (?.)
    # "Bearer abc123".split(" ").last => "abc123"
  end
end
```

---

### `app/controllers/application_controller.rb`

The base class all controllers inherit from. Sets up global error handling.

```ruby
class ApplicationController < ActionController::API  # API mode: no sessions, cookies, views
  include Authenticatable   # Mix in the token-auth module

  rescue_from ActiveRecord::RecordNotFound, with: :not_found   # Like Express error middleware
  rescue_from ActiveRecord::RecordInvalid,  with: :unprocessable

  private

  def not_found
    render json: { error: "Not found" }, status: :not_found
  end

  def unprocessable(e)
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
    # full_messages: ["Email can't be blank", "Password is too short"]
  end
end
```

---

### `app/controllers/api/v1/auth_controller.rb`

```ruby
module Api
  module V1
    class AuthController < ApplicationController
      before_action :authenticate_user!, only: [:logout]  # Only logout needs auth

      def register
        user = User.new(register_params)   # Instantiate (not saved yet)
        user.save!                          # Save, or raise RecordInvalid (caught by rescue_from above)
        render json: user_response(user), status: :created  # 201
      end

      def login
        user = User.find_by(email: login_params[:email])
        if user&.authenticate(login_params[:password])  # authenticate() from has_secure_password
          user.regenerate_token!                          # Rotate token on every login
          render json: user_response(user), status: :ok
        else
          render json: { error: "Invalid email or password" }, status: :unauthorized
        end
      end

      def logout
        current_user.invalidate_token!  # Wipe token from DB — token is now dead
        head :no_content                 # 204 with no body
      end

      private

      def register_params
        params.permit(:name, :email, :password, :password_confirmation)
        # Strong parameters: whitelist what's allowed. Rails will reject anything else.
        # Equivalent to picking specific keys from req.body in Express.
      end

      def user_response(user)
        { user: { id: user.id, name: user.name, email: user.email }, token: user.token }
      end
    end
  end
end
```

---

### `app/controllers/api/v1/listings_controller.rb`

```ruby
class ListingsController < ApplicationController
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  before_action :set_listing, only: [:show, :update, :destroy]    # Sets @listing before those actions run
  before_action :authorize_owner!, only: [:update, :destroy]

  def index
    listings = RvListing.includes(:owner).all   # includes() = eager load — like SQL JOIN or Prisma include
    render json: listings.map { |l| listing_json(l) }  # map is the same as JS .map()
  end

  def create
    listing = current_user.rv_listings.create!(listing_params)
    # current_user.rv_listings is an ActiveRecord association scope
    # .create! automatically sets owner_id = current_user.id
    render json: listing_json(listing), status: :created
  end

  private

  def set_listing
    @listing = RvListing.includes(:owner).find(params[:id])
    # find() raises RecordNotFound if not found → caught by rescue_from → 404
    # params[:id] comes from the route (:id in /listings/:id)
  end

  def listing_params
    params.permit(:title, :description, :location, :price_per_day)
  end
end
```

---

### `app/controllers/api/v1/bookings_controller.rb`

Notable design decision: there are **two separate endpoints** for fetching bookings — `/bookings/as_hirer` and `/bookings/as_owner`. This is cleaner than a single endpoint with a query param because the data shape differs (owner view includes hirer info).

```ruby
def as_owner
  bookings = Booking.includes(:hirer, rv_listing: :owner)
                    .joins(:rv_listing)
                    .where(rv_listings: { owner_id: current_user.id })
  # This is a SQL join + filter:
  # SELECT bookings.* FROM bookings
  #   JOIN rv_listings ON rv_listings.id = bookings.rv_listing_id
  #   WHERE rv_listings.owner_id = <current_user.id>
end
```

---

### `app/controllers/api/v1/messages_controller.rb`

Messages are gated — you must be the listing owner OR have a booking on that listing to read/send messages.

```ruby
def authorize_access!
  is_owner   = @listing.owner_id == current_user.id
  has_booking = @listing.bookings.exists?(user_id: current_user.id)
  # exists? runs: SELECT 1 FROM bookings WHERE rv_listing_id=? AND user_id=? LIMIT 1
  render json: { error: "Forbidden" }, status: :forbidden unless is_owner || has_booking
end
```

---

### `db/seeds.rb`

Loads sample data into the database. Run with `rails db:seed`. Uses `find_or_create_by!` so it's idempotent — safe to run multiple times without creating duplicates.

```ruby
owner1 = User.find_or_create_by!(email: "owner1@example.com") do |u|
  u.name = "Alice Owner"
  u.password = "password123"
end
# The block only runs if the record doesn't exist yet.
# It's like: INSERT ... WHERE NOT EXISTS, or upsert.
```

Seed accounts you can log in with: `owner1@example.com`, `owner2@example.com`, `hirer1@example.com` — all password `password123`.

---

## 5. File-by-file: Next.js frontend

### `types/index.ts`

TypeScript interfaces that mirror what the Rails API returns. No library here — just plain interfaces used throughout the app.

```ts
interface RVListing {
  id: number;
  price_per_day: string;  // String because Rails serializes Decimal as string to avoid float precision issues
  owner: { id: number; name: string };
  ...
}
```

---

### `lib/api.ts`

A single typed API client. Every call to the Rails backend goes through here. The `request<T>()` function:

1. Reads the auth token from `localStorage`
2. Sets `Authorization: Bearer <token>` on every request
3. Parses the JSON response
4. Throws an `Error` if the response is not `ok` (so callers can `catch`)
5. Returns `undefined` for 204 responses (no body)

All the specific API functions are namespaced on the `api` object:

```ts
api.fetchListings()
api.createBooking(listingId, { start_date, end_date })
api.confirmBooking(id)
api.login(email, password)
```

---

### `contexts/AuthContext.tsx`

React Context providing global auth state. Key behaviour:

**`initializing` flag** — On mount, the provider reads `localStorage` to restore a persisted session. Until that read completes, `initializing` is `true`. Pages that redirect unauthenticated users must wait for `initializing` to be `false` before redirecting, otherwise they'll redirect logged-in users (whose token hasn't been read from storage yet).

```tsx
// Wrong — redirects before localStorage is read:
if (!isAuthenticated) router.push('/auth/login')

// Correct:
if (!initializing && !isAuthenticated) router.push('/auth/login')
```

Token strategy: on login, the API returns a new token (the old one is replaced in the DB). On logout, the token is set to `null` in the DB — the stored token is dead even if someone extracts it from localStorage.

---

### `app/layout.tsx`

The root layout wraps every page. It:
- Loads `Fraunces` (display serif, used for headings) and `Outfit` (sans-serif, used for body) from Google Fonts via `next/font/google`
- Exposes them as CSS variables `--font-fraunces` and `--font-outfit`
- Wraps children in `<AuthProvider>` so every page has auth context
- Renders `<Navbar>`

---

### `app/page.tsx` (Home)

Server Component. Fetches listings from the Rails API at request time (server-side). Renders the hero section and passes listings to `<ListingsGrid>` (a Client Component that handles search filtering on the client).

---

### `app/listings/[id]/page.tsx` (Listing detail)

Server Component. Fetches one listing from the API. Renders:
- Dark header image area with lamp badge
- Title, location, description
- Illumina lamp callout block
- `<BookingForm>` — Client Component, shows date pickers and calls `api.createBooking()`
- `<MessagesSection>` — Client Component, shows message thread and polls every 10s

---

### `app/listings/[id]/BookingForm.tsx`

Client Component. Guards:
- Not authenticated → shows "Sign in" link
- Is the listing owner → shows "This is your listing"
- Otherwise → shows date pickers + submit

On success shows a confirmation message. Errors (e.g. "You cannot book your own listing") surface from the thrown `Error` in `api.ts`.

---

### `app/listings/[id]/MessagesSection.tsx`

Client Component. Polls for messages every 10 seconds via `setInterval`. The `authorize_access!` guard on the Rails side returns 403 if the user has no booking — the component catches that and shows "Book this rig to message the owner."

---

### `app/bookings/page.tsx`

Client Component. Two tabs: "My Rentals" (as hirer) and "My Listings' Bookings" (as owner). Owners can confirm or reject pending bookings from the owner tab. Uses the `initializing` guard to avoid flash-redirecting to login.

---

### `components/Navbar.tsx`

Client Component (needs auth context to show Sign In vs. username). Shows "Lampify" brand, nav links, and auth buttons.

---

### `components/BookingCard.tsx`

Renders a single booking. When `showActions=true` and `booking.status === "pending"`, renders Confirm and Reject buttons that call `onConfirm`/`onReject` callbacks passed from the parent.

---

## 6. How a request flows end-to-end

Example: **hirer books a listing**.

```
Browser
  └─ BookingForm submits dates
       └─ api.createBooking(listingId, { start_date, end_date })
            └─ fetch POST /api/v1/listings/1/bookings
                 └─ Rails router: listings#bookings → BookingsController#create
                      ├─ before_action :authenticate_user!
                      │    └─ reads Authorization header, finds User by token
                      ├─ listing = RvListing.find(params[:listing_id])
                      ├─ guard: listing.owner_id == current_user.id → 422
                      ├─ booking = listing.bookings.create!(hirer: current_user, ...)
                      │    ├─ Model validates end_date > start_date
                      │    └─ Model validates hirer ≠ owner
                      └─ render json: booking_json(booking), status: :created
                           └─ { id, start_date, end_date, status: "pending", rv_listing: {...} }
  └─ BookingForm shows success message
```

---

## 7. Auth system explained

Rails chose **opaque Bearer tokens** stored in the `users.token` column.

**Why not JWT?**
JWTs are self-contained — the server can't revoke them without a blocklist. Opaque tokens are just random strings looked up in the DB on every request, so logout is instant (set token to `null`).

**Token lifecycle:**
1. `POST /auth/register` → token generated by `before_create :generate_token` → returned to client
2. `POST /auth/login` → `user.regenerate_token!` rotates the token → returned to client
3. Every authenticated request → `User.find_by(token: token)` — one DB lookup per request
4. `DELETE /auth/logout` → `user.invalidate_token!` sets `token = nil` → all existing clients are kicked out

**Frontend storage:**
Token stored in `localStorage` as `rv_token`. Sent as `Authorization: Bearer <token>` on every API request via `lib/api.ts`.

---

## 8. Testing with RSpec and Rswag

### RSpec basics

RSpec is Ruby's most popular test framework. The syntax is different from Jest but the concepts map directly:

| Jest | RSpec |
|------|-------|
| `describe('thing', () => {})` | `RSpec.describe 'thing' do ... end` |
| `it('does x', () => {})` | `it 'does x' do ... end` |
| `expect(x).toBe(y)` | `expect(x).to eq(y)` |
| `expect(x).toBeTruthy()` | `expect(x).to be_truthy` |
| `beforeEach(() => {})` | `before(:each) do ... end` |
| `jest.fn()` | `double()` or `instance_double()` |

### FactoryBot

FactoryBot builds test records. It's like a typed factory function.

```ruby
# spec/factories/users.rb
FactoryBot.define do
  factory :user do
    sequence(:name) { |n| "User #{n}" }   # Each call gets a unique name: "User 1", "User 2"...
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "password123" }
  end
end

# In tests:
create(:user)                              # Persists to DB
build(:user)                               # In-memory only, not saved
create(:user, email: "custom@test.com")    # Override specific attributes
```

### DatabaseCleaner

Wraps each test in a DB transaction that rolls back when the test ends — so tests don't pollute each other. Configured in `rails_helper.rb`.

### Rswag — tests that also generate docs

Rswag is the key innovation in this project. The request specs in `spec/requests/` use the Rswag DSL. Running these specs does two things at once:

1. **Runs actual HTTP requests against the Rails app** (integration tests)
2. **Records the routes/responses into `swagger/v1/swagger.yaml`** (API documentation)

```ruby
# spec/requests/auth_spec.rb
path '/api/v1/auth/register' do     # ← Swagger path definition
  post 'Register a new user' do     # ← Swagger operation
    tags 'Auth'
    consumes 'application/json'

    parameter name: :body, in: :body, schema: { ... }   # ← Swagger parameter schema

    response '201', 'user registered' do   # ← Swagger response + actual test
      let(:body) { { name: 'Alice', email: 'alice@example.com', password: 'password123' } }
      run_test! do |response|             # ← run_test! fires the real HTTP request
        data = JSON.parse(response.body)
        expect(data['token']).to be_present   # ← assertion
      end
    end
  end
end
```

**To regenerate the swagger docs:**
```bash
bundle exec rake rswag:specs:swaggerize RAILS_ENV=test
```

**To view the Swagger UI:** visit `http://localhost:3001/api-docs`

---

## 9. Docker and local dev setup

### `docker-compose.yml`

Defines three services for production-like deployment:

```yaml
services:
  db:       # PostgreSQL 16 — data persisted in a named volume
  api:      # Rails app — built from ./camplify-rv-api/Dockerfile
  frontend: # Next.js — built from ./frontend/Dockerfile
```

Run everything with: `docker compose up --build`

### Local dev (what we're actually running)

For development, only PostgreSQL runs in Docker. Rails and Next.js run directly:

```bash
# Start PostgreSQL (port 5433 — 5432 was taken)
docker run -d --name pg-dev -e POSTGRES_PASSWORD=password -p 5433:5432 postgres:16-alpine

# Start Rails API on port 3001
cd camplify-rv-api
bundle exec rails server -p 3001

# Start Next.js on port 3002
cd frontend
npm run dev -- -p 3002
```

Port notes:
- Port 3000 is intercepted by an IDE SSH proxy
- Port 5432 was taken by another Postgres instance
- Rails runs on 3001, Next.js on 3002

### Environment config

Rails database config is in `config/database.yml`. For local dev it connects to:
- Host: `localhost`
- Port: `5433`
- Username: `postgres`
- Password: `password`

Next.js uses `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:3000/api/v1` in `lib/api.ts`).

---

## 10. Ruby syntax cheat-sheet for JS devs

```ruby
# Variables — no let/const/var, just assign
name = "Alice"
CONSTANT = 42          # Uppercase = constant (warning if reassigned)
@instance_var          # @ prefix = instance variable (lives on the object)
@@class_var            # @@ = class variable (shared across all instances)

# Strings
"Hello #{name}"        # String interpolation (like JS template literals)
'No #{interpolation}'  # Single quotes = literal, no interpolation

# Arrays
arr = [1, 2, 3]
arr.map { |x| x * 2 }            # [2, 4, 6] — like JS .map(x => x * 2)
arr.select { |x| x > 1 }         # [2, 3] — like JS .filter(x => x > 1)
arr.each { |x| puts x }           # Like JS .forEach()
arr.first                          # arr[0]
arr.last                           # arr[-1]
%w[foo bar baz]                    # ["foo", "bar", "baz"] — array-of-strings literal

# Hashes (like JS objects/Maps)
h = { name: "Alice", age: 30 }    # Symbol keys (most common)
h[:name]                           # "Alice"
h["name"]                          # nil — string key != symbol key
h = { "name" => "Alice" }          # String keys use =>

# Symbols
:name                              # Immutable identifier — like a string that's always the same object
                                   # Used extensively for hash keys, options, etc.

# Blocks — anonymous functions passed to methods
[1,2,3].map { |x| x * 2 }        # Inline block with {}
[1,2,3].map do |x|                 # Multi-line block with do...end
  x * 2
end

# Methods
def greet(name)
  "Hello, #{name}"                 # Last expression is the return value (implicit return)
end

def greet!(name)                   # ! = "dangerous" or "mutating" version (convention)
  name.upcase!                     # .upcase! modifies in place; .upcase returns a copy
end

def find(id = nil)                 # Default parameter
end

# Conditionals
if x > 0
  "positive"
elsif x < 0
  "negative"
else
  "zero"
end

result = x > 0 ? "pos" : "neg"    # Ternary — same as JS

puts "hello" if condition          # Inline if — "unless" is the opposite of "if"
return if name.nil?                # nil is Ruby's null/undefined

# nil checks
name.nil?                          # true if nil
name&.upcase                       # Safe navigation — returns nil if name is nil (like name?.upcase in JS)
name || "default"                  # Returns "default" if name is nil or false

# Classes
class Dog
  attr_reader :name      # Creates a getter method: def name; @name; end
  attr_writer :age       # Creates a setter method: def age=(v); @age = v; end
  attr_accessor :breed   # Creates both getter and setter

  def initialize(name)
    @name = name         # @ = instance variable
  end
end

# Modules / Concerns
module Greetable
  def greet
    "Hello, I'm #{name}"
  end
end

class Person
  include Greetable    # Mixes in the module's methods
end

# Ranges
(1..5).to_a            # [1, 2, 3, 4, 5] — inclusive
(1...5).to_a           # [1, 2, 3, 4]   — exclusive end

# Common methods
"hello".upcase         # "HELLO"
"hello".include?("el") # true — ? suffix = predicate method returning boolean (convention)
42.to_s                # "42"
"42".to_i              # 42
[1,2].empty?           # false
nil.present?           # false (Rails adds present? — opposite of blank?)
"".blank?              # true (Rails adds blank?)
```

### Rails-specific patterns you'll see

```ruby
# before_action — runs code before controller actions (like Express middleware)
before_action :authenticate_user!
before_action :set_listing, only: [:show, :update, :destroy]

# render — sends the response
render json: { key: "value" }, status: :ok     # :ok is the symbol for HTTP 200
render json: data, status: :created             # 201
head :no_content                                # 204 with no body

# params — the request parameters (merged query string + body + route params)
params[:id]              # Route param (/listings/:id)
params[:email]           # Body or query string param
params.permit(:name, :email)  # Whitelist — strong parameters

# ActiveRecord query methods (chainable, like SQL builder)
User.find(1)                          # Find by PK, raises if not found
User.find_by(email: "a@b.com")        # Returns nil if not found
User.where(active: true)              # Returns a relation (lazy — no query yet)
User.where(active: true).limit(10)    # Still lazy
User.where(active: true).to_a        # Executes the query
User.includes(:rv_listings)           # Eager load association (prevents N+1)
user.rv_listings.create!(title: "x") # Create associated record
listing.bookings.exists?(user_id: 1) # SELECT 1 ... LIMIT 1
```
