const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // React dev server
    'https://your-netlify-app.netlify.app', // Replace with your actual Netlify URL
    /\.netlify\.app$/ // Allow all Netlify subdomains
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const { router: authRouter } = require('./routes/auth');
app.use('/api/auth', authRouter);
app.use('/api/registration', require('./routes/registration'));
app.use('/api/students', require('./routes/students'));
app.use('/api/schools', require('./routes/schools'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/phases', require('./routes/phases'));
app.use('/api/delegate-candidates', require('./routes/delegateCandidates'));
app.use('/api/delegate-voting', require('./routes/delegateVoting'));
app.use('/api/parties', require('./routes/parties'));
app.use('/api/council-voting', require('./routes/councilVoting'));
app.use('/api/admin', require('./routes/admin'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});