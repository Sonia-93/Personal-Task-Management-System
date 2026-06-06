import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./personal/Dashboard.jsx";
import SignUpForm from "./personal/form.jsx";
import LoginForm from "./personal/login.jsx";
import Tasks from "./personal/Tasks2.jsx";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const SignUpRoute = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return <SignUpForm />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpRoute />} />
        <Route path="/signup" element={<SignUpRoute />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/landing" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
