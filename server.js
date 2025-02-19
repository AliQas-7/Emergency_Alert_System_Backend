// server.js
require('dotenv').config();
const fs = require('fs');
const os = require('os');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const socketIo = require('socket.io');
const routes = require('./routes/routes'); // Consolidated routes for /api
const adminRoutes = require('./routes/adminroutes'); // Routes for /api/admin
const User = require('./models/userModel'); // Reference the User model
const { syncUserProfile, syncAllUserProfiles } = require('./controllers/userController'); // Import sync functions

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


// Decode the Base64 key and write it to a temporary file
const base64Key = process.env.GOOGLE_CREDENTIALS_BASE64;
if (!base64Key) {
    throw new Error("Environment variable GOOGLE_CREDENTIALS_BASE64 is not set.");
}

// Dynamically determine the temporary directory
const tempDir = os.tmpdir(); // Gets the temporary directory for the system
const keyFilePath = path.join(tempDir, 'service-account-key.json');

const decodedKey = Buffer.from(base64Key, 'base64').toString('utf-8');
fs.writeFileSync(keyFilePath, decodedKey, 'utf-8');

// Set the GOOGLE_APPLICATION_CREDENTIALS environment variable to the temporary file path
process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFilePath;

console.log(`Service account key written to ${keyFilePath}`);

const port = process.env.PORT || 5000; // Ensure you use the PORT environment variable

const corsOptions = {
  origin: '*', // Allow all origins for testing
  optionsSuccessStatus: 200,
};


app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://roman10132526:sos123456@cluster0.a1aub.mongodb.net/';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if MongoDB connection fails
  });

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes
app.use('/api', routes);           // Main app routes under /api
app.use('/api/admin', adminRoutes); // Admin routes under /api/admin

// Health check route for Cloud Run
app.get('/', (req, res) => {
  res.status(200).send('OK');
});

// Start syncing Firestore data
const syncInterval = 60000; // 60 seconds

const startFirestoreSync = () => {
  setInterval(async () => {
    try {
      const users = await User.find({}); // Fetch users from MongoDB
      for (const user of users) {
        const updatedUser = await syncUserProfile(user.uid); // Sync each user
        if (updatedUser) {
          console.log(`Successfully synced user: ${user.uid}`);
        }
      }
    } catch (error) {
      console.error('Error during Firestore sync:', error);
    }
  }, syncInterval);
};


// Start syncing all profiles on server start
syncAllUserProfiles();  // Sync Firestore profiles to MongoDB when the backend starts

// Start continuous sync every syncInterval
startFirestoreSync();

// Use server.listen instead of app.listen
server.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
