# Expense Tracker App

A full-stack expense tracking application with authentication, charts, and AI-powered spending insights.

## Features

- User authentication with login and registration
- Add, edit, and view personal expenses
- Category-based expense organization
- Dashboard statistics and visual summaries
- AI-generated insights for spending patterns

## Tech Stack

- Frontend: React, Vite, React Router, Recharts
- Backend: Node.js, Express, MongoDB, JWT, bcrypt
- AI: Google Gemini API

## Project Structure

- client: React frontend
- server: Express backend API

## Getting Started

### 1. Install dependencies

In the client folder:

```bash
npm install
```

In the server folder:

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the server directory with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run the app

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend:

```bash
cd client
npm run dev
```

The frontend will be available in the browser, and the backend API will run on the configured port.

## Notes

- Make sure MongoDB is running or reachable through the provided connection string.
- The AI insights feature depends on a valid Gemini API key.


