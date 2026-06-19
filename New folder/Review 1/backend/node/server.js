// backend/node/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routing
app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Welcome to Luxury Stay Hotel Management Backend API." });
});

// Run server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
