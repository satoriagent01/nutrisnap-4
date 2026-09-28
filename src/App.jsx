import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import MealPlanner from './pages/MealPlanner';
import History from './pages/History';
import Settings from './pages/Settings';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ns_user')) || null;
    } catch {
      return null;
    }
  });

  const saveUser = (u) => {
    setUser(u);
    localStorage.setItem('ns_user', JSON.stringify(u));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} saveUser={saveUser} />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/scanner"
          element={user ? <Scanner user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/meal-planner"
          element={user ? <MealPlanner user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/history"
          element={user ? <History user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/settings"
          element={user ? <Settings user={user} saveUser={saveUser} /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
