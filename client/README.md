# Expense AI Tracker

Expense AI Tracker is a full-stack expense management app designed to help users track spending, monitor category trends, and explore AI-powered financial insights.

## Features

- Secure authentication with login and registration flows
- Add, edit, delete, and search expense entries
- Filter expenses by category and keyword
- Dashboard with totals, monthly trends, and category breakdowns
- AI-generated financial insights and budget suggestions
- Light and dark mode toggle on the login page
- Demo login access for quick UI testing without real credentials
- Protected routes for authenticated users

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Charts: Recharts
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Authentication: JWT
- AI: Google Gemini API

## Project Structure

```bash
.
├── client/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── index.js
│   └── package.json
└── README.md
```

## Demo Access

The login page includes a demo option so users can explore the product without creating a real account or using test data.

Available demo roles:

- Demo User
- Developer Demo

These demo sessions instantly open the dashboard and let you review the application flow.

## Getting Started

### 1. Install frontend dependencies

```bash
cd client
npm install
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the app

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

Then open the frontend in your browser, usually at:

```bash
http://localhost:5173
```

## Notes

- MongoDB must be running and reachable using the provided `MONGO_URI`.
- The AI insights feature requires a valid Google Gemini API key.
- If you want to test the UI without backend auth, use the demo buttons from the login screen.

## Typical User Flow

1. Sign in or use demo access
2. Add expenses from the expense page
3. Review dashboard summaries and trends
4. Generate AI-powered spending insights
5. Adjust budgets and spending habits based on recommendations

## License

This project is for educational and demo purposes.


