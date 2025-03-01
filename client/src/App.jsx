import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import DisplayTasks from './Pages/tasks/DisplayTasks';
import AddTask from './Pages/tasks/AddTask';
import TaskDetails from './Pages/tasks/TaskDetail';
import CreateTask from './Pages/tasks/CreateTask';
import AdminDashboard from './Pages/AdminDashboard';
import Leaderboard from './Pages/Leaderboard';
import Contact from './Pages/Contact';
import About from './Pages/About';
import NotFound from './Pages/NotFound';
import { useState, useEffect } from 'react';

function ProtectedRoute({ children, allowedRoles }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || '');

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <div className="bg-white min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={<DisplayTasks />} />
        <Route path="/tasks/create" element={<AddTask />} />
        <Route path="/task/:taskId" element={<TaskDetails />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
