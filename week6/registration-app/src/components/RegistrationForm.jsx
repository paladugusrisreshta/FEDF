import React, { useState } from "react";
function RegistrationForm() {
  // Hook: useState
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(
      `Registration Successful!
       Name: ${name},
       Email: ${email},
       Course: ${course}`
    );
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
         <br />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
          <br />

        <label>Course:</label>
        <input
          type="text"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />
        <br /><br />
        <button type="submit">Register</button>
      </form>
      <h3>{message}</h3>
    </div>
  );
}
export default RegistrationForm;