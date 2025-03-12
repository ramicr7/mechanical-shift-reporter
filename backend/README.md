
# Shift Reporter Backend

This is the backend service for the Shift Reporter application, providing REST APIs for authentication and report management.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/shift_reporter
   JWT_SECRET=your_jwt_secret_should_be_complex_and_unique
   JWT_EXPIRE=24h
   ```

3. Seed the database with initial users:
   ```
   node seeder.js -i
   ```

4. Start the server:
   ```
   npm start
   ```
   
   Or for development with auto-reload:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/me` - Get current user info (requires authentication)

### Reports
- `GET /api/reports` - Get all reports (requires authentication)
- `GET /api/reports/:id` - Get a specific report (requires authentication)
- `POST /api/reports` - Create a new report (requires authentication)
- `PUT /api/reports/:id` - Update a report (requires authentication)
- `DELETE /api/reports/:id` - Delete a report (requires admin role)

## Authorization

- Regular users can only edit reports with "Open" or "Ongoing" status
- Regular users cannot modify certain fields (title, description, area, etc.)
- Only admin users can delete reports
