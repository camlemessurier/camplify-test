# Ruby on Rails Technical Test: RV Marketplace

## Overview

This technical test is designed to assess your ability to build a RESTful API using Ruby on Rails for a two-sided marketplace. The platform connects RV owners (lessors) with renters (hirers). A key goal of this test is to see how you leverage modern AI programmatic tools (such as GitHub Copilot, Cursor, or similar) to accelerate development, improve code quality, and expand the solution.

The primary task is to build the backend for listing management, lead generation, messaging, and booking requests.

## Core Requirements

1. Framework
   - Use Ruby on Rails in API mode.

2. Models & Associations
   - Create the following models with the specified relationships:
     - **User**: A user has a name and an email. A user can be an RV owner and/or a hirer.
     - **RVListing**: An RV listing has a title, description, location, and a price per day. It belongs to a User (the owner) and has many Bookings and many Messages.
     - **Booking**: A booking represents a hire request. It has a start date, end date, and a status (e.g., `pending`, `confirmed`, `rejected`). It belongs to a User (the hirer) and belongs to an RVListing.
     - **Message**: A message facilitates communication between an owner and a hirer about a specific listing. It has content and belongs to a User and an RVListing.

3. API Endpoints
   - Implement a RESTful API for the following resources. All endpoints should return JSON.

   - **RV Listings**:
     - `GET /listings`: List all available RV listings.
     - `GET /listings/:id`: Show a single RV listing.
     - `POST /listings`: Create a new RV listing.
     - `PUT/PATCH /listings/:id`: Update an existing RV listing.
     - `DELETE /listings/:id`: Delete an RV listing.

   - **Bookings**:
     - `POST /listings/:listing_id/bookings`: Create a new booking request for a specific RV.
     - `GET /bookings`: List all bookings for the authenticated user (either as a hirer or owner).
     - `PATCH /bookings/:id/confirm`: An RV owner can confirm a booking request.
     - `PATCH /bookings/:id/reject`: An RV owner can reject a booking request.

4. Authentication & Authorization
   - Implement a token-based authentication system for users.
   - Creating, updating, or deleting an RVListing should only be possible for the authenticated owner of that listing.
   - Creating a Booking should only be possible for a logged-in user who is not the listing owner.
   - Confirming or rejecting a Booking should only be possible for the owner of the associated RVListing.

## Bonus Tasks (Leveraging AI Tools)

These tasks are not strictly required for a passing grade but are excellent opportunities to demonstrate your proficiency with AI coding tools. Your ability to use these tools to quickly generate and verify code will be evaluated.

1. Comprehensive Test Coverage
   - Use RSpec to create a robust test suite.
   - Focus on covering model validations, controller actions, and happy/sad paths for all new endpoints (e.g., a successful booking request vs. an unauthorized attempt to confirm a booking).
   - The goal is to demonstrate how you can use an AI tool to rapidly scaffold and fill out a comprehensive test suite.

2. API Documentation
   - Generate API documentation. This could be a simple Markdown file or, for extra points, use a gem like Rswag or Swagger to create interactive, machine-readable documentation based on your RSpec tests.
   - The prompt to the AI tool could be as simple as: `Generate Rswag documentation for the RV Marketplace API endpoints.`

3. Deployment Readiness
   - Add a `Dockerfile` and a `docker-compose.yml` file to containerize the application. This shows an understanding of modern deployment practices.
   - This is another great place to use an AI tool for generating the initial boilerplate.

4. Vibe Coding (Optional)
   - Vibe code a simple HTML/CSS/JS or React front-end page that consumes one of your API endpoints (e.g., the page that lists all RVs).
   - This demonstrates an ability to rapidly prototype a user experience. You can use an AI tool to generate the code and styling based on a prompt like: `Vibe code a clean, modern front-end for an RV rental marketplace using TailwindCSS.`

## Submission & Evaluation

Submit a link to a Git repository containing your solution. The evaluation will focus not only on the correctness of the code but also on your project structure, adherence to Rails conventions, and the overall quality of the solution. We will also be looking for evidence of how you leveraged AI tools, particularly in the bonus tasks.
