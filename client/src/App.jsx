import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import DisplayTasks from './Pages/tasks/DisplayTasks';
import TaskDetails from './Pages/tasks/TaskDetail';
import CreateTask from './Pages/tasks/CreateTask';
import AdminDashboard from './Pages/AdminDashboard';
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
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/tasks" element={<DisplayTasks />} />
      <Route path="/task/:taskId" element={<TaskDetails />} />
      <Route
        path="/tasks/create"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <CreateTask />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
