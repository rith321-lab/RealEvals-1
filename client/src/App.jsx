import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import DisplayTasks from './Pages/tasks/DisplayTasks';
import TaskDetails from './Pages/tasks/TaskDetail';
// import NotFound from './Pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/tasks" element={<DisplayTasks />} />
      <Route path="/task/:taskId" element={<TaskDetails />} />

      {/* <Route element={<RequireAuth allowedRoles={['ADMIN', 'USER']} />}></Route>
      <Route element={<RequireAuth allowedRoles={['ADMIN']} />}></Route> */}
    </Routes>
  );
}

export default App;
