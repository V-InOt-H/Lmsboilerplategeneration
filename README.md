# Zoho Learning Application - Corporate LMS

A comprehensive Learning Management System built with React (Frontend) and Node.js/Express/MongoDB (Backend) featuring a modern glassmorphism dark theme and bento box layout.

## 🎯 Features

### Multi-Role Support
- **Super Admin**: Full system access
- **Admin/HR**: User management, analytics, settings
- **Trainer**: Course creation, assessment builder, content management
- **Learner**: Course enrollment, learning paths, certificates

### Core Functionality
- ✅ **Course Management**: Create courses with modules and lessons (PDF/Video/Links/Text)
- ✅ **Assessment System**: MCQ and True/False quizzes with auto-evaluation
- ✅ **Knowledge Base**: Article management with versioning
- ✅ **Certificate Generation**: Auto-generated upon 100% course completion
- ✅ **Analytics Dashboard**: Comprehensive insights and CSV export
- ✅ **User Management**: CRUD operations with role-based access
- ✅ **Progress Tracking**: Real-time course progress monitoring
- ✅ **Notifications**: System-wide notification system

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom shadcn/ui components
- **State Management**: React Context API
- **Charts**: Recharts for analytics visualization
- **Icons**: Lucide React

### Backend (Node.js + Express + MongoDB)
Located in `/backend` folder (reference code - run separately)

#### Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **Security**: bcryptjs for password hashing

#### API Structure
```
/api
  /auth        - Authentication endpoints
  /users       - User management
  /courses     - Course CRUD and enrollment
  /assessments - Quiz management and submission
  /knowledge   - Knowledge base articles
  /certificates - Certificate generation
  /analytics   - Dashboard and reports
  /settings    - Organization settings
  /notifications - User notifications
```

## 📦 Installation & Setup

### Frontend Setup
```bash
# Install dependencies (already included)
# The frontend is ready to run in Figma Make

# For local development:
npm install
npm run build
```

### Backend Setup
1. **Create separate backend project:**
```bash
mkdir zoho-lms-backend
cd zoho-lms-backend
npm init -y
```

2. **Install dependencies:**
```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken cors cookie-parser
npm install nodemon --save-dev
```

3. **Copy backend files:**
Copy all files from the `/backend` folder to your backend project

4. **Create `.env` file:**
```env
MONGO_URI=mongodb://localhost:27017/zoho-lms
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

5. **Start MongoDB:**
```bash
# Using MongoDB locally
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGO_URI in .env with your Atlas connection string
```

6. **Run backend server:**
```bash
npm run dev
```

### Connect Frontend to Backend
Update `/src/services/api.js`:
```javascript
const API_URL = 'http://localhost:5000/api';
```

## 🎨 Design System

### Glassmorphism Theme
- **Background**: Dark gradient (slate-950 → indigo-950 → slate-900)
- **Cards**: Semi-transparent with backdrop blur
- **Borders**: White with 10-20% opacity
- **Primary Colors**: Indigo (#6366f1) and Purple (#8b5cf6)

### Bento Box Layout
- Grid-based dashboard with varying card sizes
- Responsive design (mobile, tablet, desktop)
- Stats cards, charts, and quick actions

## 🔐 Authentication Flow

1. User logs in with email/password
2. Backend validates credentials
3. JWT token generated and returned
4. Token stored in localStorage
5. Token sent with all API requests
6. Backend middleware validates token
7. Role-based access control enforced

## 📊 Database Models

### User
- Personal info, role, status
- Enrolled courses with progress tracking
- Authentication fields

### Course
- Title, description, category, level
- Modules with nested lessons
- Enrollment tracking

### Assessment
- Questions (MCQ/True-False)
- Passing score, duration, attempts
- Auto-evaluation logic

### Assessment Result
- User answers with evaluation
- Score, percentage, pass/fail status

### Knowledge Base
- Articles with versioning
- Categories, tags, views
- Helpful/Not helpful feedback

### Certificate
- Unique certificate number
- Course and user references
- Issued date, completion date

### Notification
- Type-based notifications
- Read/unread status
- Linked resources

### Settings
- Organization branding
- Feature toggles
- Security configurations

## 🚀 Usage

### Demo Credentials
```
Admin:
Email: admin@zoho.com
Password: admin123

Trainer:
Email: trainer@zoho.com
Password: trainer123

Learner:
Email: learner@zoho.com
Password: learner123
```

### Creating a Course (Trainer/Admin)
1. Navigate to "Courses"
2. Click "Create Course"
3. Fill in course details
4. Add modules and lessons
5. Set status to "Published"
6. Save

### Enrolling in a Course (Learner)
1. Browse "Courses"
2. Select a course
3. Click "Enroll" or "View Course"
4. Start learning!

### Taking an Assessment (Learner)
1. Navigate to "Assessments"
2. Select an assessment
3. Answer all questions
4. Submit to see results
5. Get instant feedback

### Generating Certificates (Auto)
- Complete 100% of course content
- System auto-generates certificate
- View in "Certificates" section
- Download as needed

## 📈 Performance

- **Page Load**: < 3 seconds (optimized)
- **Responsive**: Mobile, tablet, desktop
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Protected API routes
- Input validation
- Session management

## 📝 API Documentation

### Authentication
```
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
POST /api/auth/forgot-password
PUT  /api/auth/reset-password/:token
```

### Courses
```
GET    /api/courses
POST   /api/courses
GET    /api/courses/:id
PUT    /api/courses/:id
DELETE /api/courses/:id
POST   /api/courses/:id/enroll
PUT    /api/courses/:id/progress
```

### Assessments
```
GET    /api/assessments
POST   /api/assessments
GET    /api/assessments/:id
PUT    /api/assessments/:id
DELETE /api/assessments/:id
POST   /api/assessments/:id/submit
GET    /api/assessments/:id/results
```

### Analytics
```
GET /api/analytics/dashboard
GET /api/analytics/learner
GET /api/analytics/course/:id
GET /api/analytics/export?type=users|courses|assessments
```

## 🔄 Future Enhancements

- [ ] File upload for course materials
- [ ] Video streaming integration
- [ ] Discussion forums
- [ ] Live sessions/webinars
- [ ] Gamification (badges, leaderboards)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Email notifications
- [ ] Social learning features
- [ ] API rate limiting

## 📄 License

This project is for educational purposes.

## 👥 Support

For issues or questions, refer to the backend setup documentation in `/BACKEND_SETUP.md`

---

**Built with ❤️ for modern corporate learning**
