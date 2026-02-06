const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to database
connectDB();

const app = express();

// Middleware
// CORS configuration - allow requests from frontend
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    // or from localhost for development
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000'
    ];
    
    // Check if origin is in allowed list or if no origin (mobile/curl)
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      // For production, only allow specific origins
      if (process.env.NODE_ENV === 'production') {
        callback(new Error('Not allowed by CORS'));
      } else {
        callback(null, true);
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Auto-seed users on startup
const seedUsers = async () => {
  const User = require('./models/User.model');
  
  const testUsers = [
    {
      name: 'Admin User',
      email: 'admin@zoho.com',
      password: 'admin123',
      role: 'Super Admin',
      department: 'Administration'
    },
    {
      name: 'Trainer User',
      email: 'trainer@zoho.com',
      password: 'trainer123',
      role: 'Trainer',
      department: 'Training'
    },
    {
      name: 'Learner User',
      email: 'learner@zoho.com',
      password: 'learner123',
      role: 'Learner',
      department: 'Development'
    }
  ];

  try {
    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create(userData);
        console.log(`✅ Auto-seeded user: ${userData.email}`);
      }
    }
    console.log('✅ User seeding complete');
  } catch (error) {
    console.log('⚠️ User seeding skipped (DB may not be ready)');
  }
};

// Call seeding after a short delay to ensure DB connection
setTimeout(seedUsers, 1000);

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/courses', require('./routes/course.routes'));
app.use('/api/assessments', require('./routes/assessment.routes'));
app.use('/api/knowledge', require('./routes/knowledge.routes'));
app.use('/api/certificates', require('./routes/certificate.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));
app.use('/api/settings', require('./routes/settings.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/enrollments', require('./routes/enrollment.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Zoho LMS Backend is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Zoho Learning Management System`);
});
