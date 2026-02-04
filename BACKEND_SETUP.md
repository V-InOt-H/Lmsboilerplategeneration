# Backend Setup Instructions

## Overview
This folder contains the Node.js/Express/MongoDB backend code for the Zoho Learning Application.
**Note**: These backend files are reference code. You'll need to run them in a separate Node.js environment.

## Setup Steps

### 1. Create a separate backend folder
```bash
mkdir zoho-lms-backend
cd zoho-lms-backend
npm init -y
```

### 2. Install dependencies
```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken cors cookie-parser
npm install nodemon --save-dev
```

### 3. Copy backend files
Copy all files from the `/backend` folder to your new backend project.

### 4. Create .env file
```env
MONGO_URI=mongodb://localhost:27017/zoho-lms
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/zoho-lms

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

### 5. Update package.json scripts
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### 6. Run the backend
```bash
npm run dev
```

The backend will run on http://localhost:5000

### 7. Configure Frontend
Update the frontend API URL in `/src/services/api.js` to point to your backend:
```javascript
const API_URL = 'http://localhost:5000/api';
```

## API Endpoints

### Authentication
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/forgot-password
- GET /api/auth/me

### Users (Admin only)
- GET /api/users
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id

### Courses
- GET /api/courses
- POST /api/courses (Admin/Trainer)
- PUT /api/courses/:id (Admin/Trainer)
- DELETE /api/courses/:id (Admin/Trainer)
- POST /api/courses/:id/enroll (Learner)

### Assessments
- GET /api/assessments
- POST /api/assessments (Admin/Trainer)
- POST /api/assessments/:id/submit (Learner)

### Knowledge Base
- GET /api/knowledge
- POST /api/knowledge (Admin/Trainer)
- PUT /api/knowledge/:id (Admin/Trainer)

### Certificates
- GET /api/certificates
- GET /api/certificates/:id/download

### Analytics
- GET /api/analytics/dashboard (Admin/Trainer)
- GET /api/analytics/learner (Learner)
