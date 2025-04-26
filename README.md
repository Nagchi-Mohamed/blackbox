# BrainyMath - Educational Platform

BrainyMath is a comprehensive educational platform that provides interactive math learning experiences through courses, real-time classroom sessions, and AI-assisted learning.

## Features

- User authentication and authorization
- Course management system
- Real-time classroom with whiteboard
- Interactive assessments and quizzes
- Progress tracking
- AI-powered math assistance
- File uploads and thumbnails
- Responsive design

## Tech Stack

### Backend

- Node.js
- Express.js
- MySQL
- Socket.IO
- JWT Authentication
- OpenAI Integration

### Frontend

- React
- Ant Design
- Socket.IO Client
- Chart.js
- Fabric.js
- KaTeX

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Nagchi-Mohamed/last.git
cd last
```

2. Install backend dependencies:

```bash
npm install
```

3. Install frontend dependencies:

```bash
cd client
npm install
```

4. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=brainymath
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

5. Initialize the database:

```bash
npm run setup
```

6. Start the development servers:

```bash
# Start backend
npm run dev

# In a new terminal, start frontend
cd client
npm start
```

## Project Structure

```
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   └── src/               # React source files
│       ├── components/    # Reusable components
│       ├── pages/         # Page components
│       ├── services/      # API services
│       └── styles/        # CSS/LESS styles
├── src/                   # Backend source files
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── utils/            # Helper functions
└── database.sql          # Database schema
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
