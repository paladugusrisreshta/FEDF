import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./index.css";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import BookDeletion from "./components/BookDeletion";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {

  const [isLoggedIn,
         setIsLoggedIn] =
         useState(false);

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <Login
              setIsLoggedIn={
                setIsLoggedIn
              }
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/deletebook"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
            >
              <BookDeletion />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;
