# GigFlow - Freelance Marketplace Platform

A full-stack mini-freelance marketplace where clients can post gigs and freelancers can bid on them. Built as part of the Full Stack Development Internship Assignment.

### Core Features
- **Secure Authentication** - JWT-based auth with HttpOnly cookies
- **Dual Roles** - Users can be both clients (post gigs) and freelancers (bid on gigs)
- **Gig Management** - Full CRUD operations for job postings
- **Search & Filter** - Search gigs by title
- **Bidding System** - Freelancers can submit bids with custom messages and prices
- **Hiring Logic** - Atomic hiring process with automatic bid rejection
- **Dashboard** - View hired freelancers and manage gigs

### Bonus Features Implemented
- **MongoDB Transactions** - Race condition prevention during hiring process
- **Real-time Notifications** - Socket.io integration for instant hire notifications
- **Live Status Indicator** - Shows connection status in real-time
- **Notification Center** - Bell icon with badge showing unread notifications

## Tech Stack

### Frontend
- React.js 18.x with Vite
- TypeScript
- Tailwind CSS
- Context API for state management
- React Router v6
- Axios for API calls
- Socket.io Client
- React Toastify for notifications

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Socket.io for real-time features
- Cookie-parser for HttpOnly cookies

## Project Structure

```
gigflow/
├── backend/
│   ├── config/
│   │   └── socket.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── bids.controller.js
│   │   └── gigs.controller.js
│   ├── db/
│   │   └── dbConnect.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── bid.model.js
│   │   ├── gig.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── bids.routes.js
│   │   └── gigs.routes.js
│   ├── utils/
│   │   ├── apiError.js
│   │   ├── apiResponse.js
│   │   └── asyncHandler.js
│   ├── .env.example
│   ├── app.js
│   ├── constants.js
│   └── index.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Notifications.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── BidContext.tsx
│   │   │   ├── GigContext.tsx
│   │   │   └── SocketContext.tsx
│   │   ├── lib/
│   │   │   └── axiosInstance.ts
│   │   ├── pages/
│   │   │   ├── CreateGig.tsx
│   │   │   ├── GigDetails.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── MyHiredFreelancers.tsx
│   │   │   └── Register.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configurations (see Environment Variables section)

5. Start the server:
```bash
npm run dev
```

The backend server will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with backend URL

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Environment Variables

### Backend (.env)
```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/gigflow
ACCESS_TOKEN_SECRET=your_super_secret_jwt_key_here
ACCESS_TOKEN_EXPIRY=number_of_days
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
```


## API Endpoints

### Authentication
- POST `/api/auth/register` – Register a new user
- POST `/api/auth/login` – Login and set HttpOnly cookie
- POST `/api/auth/logout` – Logout user
- GET `/api/auth/me` – Get current authenticated user

### Gigs
- GET `/api/gigs` – Fetch all open gigs (with optional search query)
- POST `/api/gigs` – Create a new gig (Authenticated)

### Bids
- POST `/api/bids` – Submit a bid for a gig (Authenticated)
- GET `/api/bids/:gigId` – Get all bids for a gig (Owner only)
- PATCH `/api/bids/:bidId/hire` – Hire a freelancer (Atomic operation)
- GET `/api/bids/hired/me` – Get all hired freelancers for current user (Authenticated)


## Demo

### Live Links
- Frontend: [[Live Frontend Website](https://gigflow-r0jy.onrender.com/)]

### Demo Video
[Add your Loom video link here]

## Author

[Your Name]

## License

This project is built for educational purposes as part of a Full Stack Development Internship Assignment.

---

For any queries, contact: [Your Email]