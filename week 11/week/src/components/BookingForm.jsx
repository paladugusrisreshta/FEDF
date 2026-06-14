import { useState } from "react";

function BookingForm() {
  const airlineName = import.meta.env.VITE_AIRLINE_NAME || "SkyJet";

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    source: "",
    destination: "",
    date: "",
  });

  const [booking, setBooking] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const flightNo = "SJ" + Math.floor(Math.random() * 900 + 100);
    const seatNo = "A" + Math.floor(Math.random() * 30);
    const gate = "G" + Math.floor(Math.random() * 10);

    setBooking({
      ...formData,
      status: "Confirmed",
      flightNo,
      seatNo,
      gate,
      classType: "Economy",
    });
  };

  return (
    <div className="booking-box">
      <section className="form-section">
        <p className="small-title">BOOK YOUR TRIP</p>
        <h2 className="main-title">{airlineName}</h2>
        <p className="subtitle">Reserve your next journey in a few quick steps.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Passenger Name</label>
          <input id="name" type="text" name="name" placeholder="Passenger Name" onChange={handleChange} required />

          <label htmlFor="age">Passenger Age</label>
          <input id="age" type="number" name="age" placeholder="Passenger Age" onChange={handleChange} required />

          <label htmlFor="source">From</label>
          <input id="source" type="text" name="source" placeholder="From" onChange={handleChange} required />

          <label htmlFor="destination">To</label>
          <input id="destination" type="text" name="destination" placeholder="To" onChange={handleChange} required />

          <label htmlFor="date">Travel Date</label>
          <input id="date" type="date" name="date" onChange={handleChange} required />

          <button type="submit">Book Flight</button>
        </form>
      </section>

      <aside className="ticket-section">
        {booking ? (
          <div className="ticket-card">
            <p className="ticket-title">🎟 FLIGHT TICKET</p>

            <p><span>Name</span>{booking.name}</p>
            <p><span>Age</span>{booking.age}</p>
            <p><span>Route</span>{booking.source} ➜ {booking.destination}</p>
            <p><span>Date</span>{booking.date}</p>

            <div className="confirm-box">
              <p><strong>Flight No:</strong> {booking.flightNo}</p>
              <p><strong>Seat No:</strong> {booking.seatNo}</p>
              <p><strong>Gate:</strong> {booking.gate}</p>
              <p><strong>Class:</strong> {booking.classType}</p>
            </div>

            <p className="status">Status: {booking.status} ✅</p>
          </div>
        ) : (
          <div className="ticket-card preview-card">
            <p className="ticket-title">✈ YOUR BOARDING PASS</p>
            <p>Your ticket details will appear here as soon as you confirm a booking.</p>
          </div>
        )}
      </aside>
    </div>
  );
}

export default BookingForm;