import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import DisplayTasks from './Pages/tasks/DisplayTasks';
import AddTask from './Pages/tasks/AddTask';
import TaskDetails from './Pages/tasks/TaskDetail';
import AdminDashboard from './Pages/admin/Dashboard';
import Leaderboard from './Pages/Leaderboard';
import Contact from './Pages/Contact';
import About from './Pages/About';
import NotFound from './Pages/NotFound';

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
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />

        {/* <Route element={<RequireAuth allowedRoles={['ADMIN', 'USER']} />}></Route>
        <Route element={<RequireAuth allowedRoles={['ADMIN']} />}></Route> */}
      </Routes>
    </div>
  );
}

export default App;
