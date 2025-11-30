# Pascovit Assignment

A full-stack web application built with the **MERN stack** (MongoDB, Express, React, Node.js). This project demonstrates modern web development practices with a scalable architecture, responsive frontend, and robust backend API.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Full-stack Architecture**: Seamless integration between frontend and backend
- **RESTful API**: Well-structured Express.js API endpoints
- **React Components**: Modular, reusable UI components with React
- **Database**: MongoDB for scalable data storage
- **Authentication**: Secure user authentication (if applicable)
- **Responsive Design**: Mobile-friendly UI using CSS/Tailwind
- **Error Handling**: Comprehensive error management on both client and server
- **Validation**: Input validation on frontend and backend

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **JavaScript/TypeScript** - Programming language
- **CSS/Tailwind CSS** - Styling
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **dotenv** - Environment variable management

### Tools & Services
- **Git** - Version control
- **npm/yarn** - Package management
- **GitHub** - Code repository
- **Postman** - API testing (optional)

## 📂 Project Structure

```
Pascovit-assignment/
├── frontend/                 # React client application
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── styles/           # CSS files
│   │   ├── utils/            # Utility functions
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .gitignore
│
├── backend/                  # Node.js/Express server
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API endpoints
│   ├── controllers/          # Business logic
│   ├── middleware/           # Custom middleware
│   ├── config/               # Configuration files
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14+ recommended)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas cloud)
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/harikrisha-14/Pascovit-assignment.git
cd Pascovit-assignment
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure your .env with database and API settings
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend

# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000` (or your configured port)

### Start Frontend Development Server

In a new terminal:

```bash
cd frontend

# Start React development server
npm start
```

The frontend will open at `http://localhost:3000`

### Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Example Endpoints

```
GET    /api/users           - Get all users
GET    /api/users/:id       - Get user by ID
POST   /api/users           - Create new user
PUT    /api/users/:id       - Update user
DELETE /api/users/:id       - Delete user
```

For detailed API documentation, refer to your Postman collection or API docs file.

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Server Configuration
PORT=5000
NODE_ENV=development

# API Keys (if applicable)
API_KEY=your_api_key_here

# JWT Secret (if using authentication)
JWT_SECRET=your_jwt_secret_here
```

**Note**: Never commit `.env` files. Use `.env.example` as a template.


## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature-name`
4. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

- **GitHub**: [@harikrisha-14](https://github.com/harikrisha-14)

## 📧 Support

For questions or issues, please open an [Issue](https://github.com/harikrisha-14/Pascovit-assignment/issues) on GitHub.

---

**Happy Coding! 🎉**
