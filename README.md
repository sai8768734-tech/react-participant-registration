# Training Program Registration System

A full-stack React application for training program registration with real-time dashboard updates.

## Features

- **Registration Form** (`/`) - Participants can register with role-based conditional fields
- **Live Dashboard** (`/list`) - Trainers can view all registrations in real-time via WebSockets
- **Real-time Updates** - New registrations appear instantly on the dashboard without page refresh
- **Form Validation** - Client-side and server-side validation for all fields
- **Email Validation** - Restricted to common email providers (gmail.com, outlook.com, yahoo.com, hotmail.com)
- **Phone Validation** - Requires country code format (+XX...)

## Tech Stack

- **Frontend**: React 18, React Router, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO
- **Data Storage**: JSON file (`server/participants.json`)
- **Styling**: Custom CSS

## Project Structure

```
.
├── client/          # React frontend application
│   ├── src/
│   │   ├── pages/   # RegistrationPage, DashboardPage
│   │   ├── services/# API and Socket.IO services
│   │   └── ...
│   └── package.json
├── server/          # Node.js backend
│   ├── server.js    # Express server with Socket.IO
│   └── participants.json  # Data storage
└── README.md
```

## Setup & Installation

### Prerequisites

- Node.js 18+ and npm

### Backend Setup

```bash
cd server
npm install
npm start
```

Backend runs on `http://localhost:4000`

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Usage

1. Start the backend server (port 4000)
2. Start the frontend dev server (port 5173)
3. Open `http://localhost:5173/` for registration
4. Open `http://localhost:5173/list` for the dashboard
5. Submit registrations and watch them appear in real-time on the dashboard

## API Endpoints

- `GET /api/participants` - Fetch all registered participants
- `POST /api/register` - Register a new participant

## WebSocket Events

- `new_participant` - Emitted when a new participant registers

## License

MIT

