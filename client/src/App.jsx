import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DisplayTasksFixed from './Pages/tasks/DisplayTasksFixed';
import CreateTask from './Pages/tasks/CreateTask';
import TaskDetail from './Pages/tasks/TaskDetail';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<DisplayTasksFixed />} />
        <Route path="/tasks" element={<DisplayTasksFixed />} />
        <Route path="/tasks/create" element={<CreateTask />} />
        <Route path="/task/:taskId" element={<TaskDetail />} />
        <Route path="*" element={<DisplayTasksFixed />} />
      </Routes>
    </Router>
  );
}

export default App;
