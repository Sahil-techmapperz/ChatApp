// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
// Import other components
import HomePage from './components/HomePage'; // Assume you have a HomePage component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (

      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          {/* Add other routes here */}
        </Routes>
      </div>
   
  );
}

export default App;
