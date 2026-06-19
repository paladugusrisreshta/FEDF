// backend/node/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();

// Mock database storage in memory for simulation
let bookings = [
  {
    id: 101,
    guestName: "Lady Genevieve Sterling",
    roomType: "Executive Suite",
    checkIn: "2026-06-10",
    checkOut: "2026-06-13",
    amount: 1950,
    status: "Confirmed"
  }
];

// Retrieve all bookings
router.get('/', (req, res) => {
  res.status(200).json(bookings);
});

// Save a booking
router.post('/', (req, res) => {
  const { guestName, roomType, checkIn, checkOut, amount } = req.body;
  
  if (!guestName || !roomType) {
    return res.status(400).json({ message: "Incomplete booking details." });
  }
  
  const newBooking = {
    id: Math.floor(100 + Math.random() * 900),
    guestName,
    roomType,
    checkIn,
    checkOut,
    amount: amount || 500,
    status: "Confirmed"
  };
  
  bookings.unshift(newBooking);
  res.status(201).json({ message: "Booking confirmed successfully.", booking: newBooking });
});

// Delete a booking
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  bookings = bookings.filter(b => b.id !== parseInt(id));
  res.status(200).json({ message: `Booking ${id} deleted successfully.` });
});

module.exports = router;
