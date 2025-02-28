import { useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineArrowLeft, AiOutlinePlus, AiOutlineDelete } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import HomeLayout from '../../Layouts/HomeLayout';
import axiosInstance from '../../Helper/axiosInstance';

function CreateTask() {
  const navigate = useNavigate();

  const [taskInput, setTaskInput] = useState({
    title: '',
    description: '',
    difficulty: '',
    webArenaEnvironment: '',
    environmentConfig: {},
  });
  const [configEntries, setConfigEntries] = useState([]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setTaskInput({ ...taskInput, [name]: value });
  }

  function handleAddConfigEntry() {
    setConfigEntries([...configEntries, { key: '', value: '' }]);
  }

  function handleConfigChange(index, field, value) {
    const updatedEntries = [...configEntries];
    updatedEntries[index][field] = value;
    setConfigEntries(updatedEntries);

    const newConfig = updatedEntries.reduce((acc, { key, value }) => {
      if (key) acc[key] = value;
      return acc;
    }, {});
    setTaskInput({ ...taskInput, environmentConfig: newConfig });
  }

  function handleRemoveConfigEntry(index) {
    const updatedEntries = configEntries.filter((_, i) => i !== index);
    setConfigEntries(updatedEntries);

    const newConfig = updatedEntries.reduce((acc, { key, value }) => {
      if (key) acc[key] = value;
      return acc;
    }, {});
    setTaskInput({ ...taskInput, environmentConfig: newConfig });
  }

  async function onFormSubmit(e) {
    e.preventDefault();

    if (!taskInput.title || !taskInput.description || !taskInput.difficulty || !taskInput.webArenaEnvironment) {
      toast.error('All fields are mandatory');
      return;
    }
    const response = await axiosInstance.post('/tasks', taskInput);
    setTaskInput({
      title: '',
      description: '',
      difficulty: '',
      webArenaEnvironment: '',
      environmentConfig: {},
    });
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-screen">
        <form onSubmit={onFormSubmit} className="flex flex-col gap-6 bg-black p-6 rounded-lg shadow-lg w-[600px]">
          <Link to="/tasks" className="text-2xl text-gray-600 cursor-pointer">
            <AiOutlineArrowLeft />
          </Link>
          <h1 className="text-center text-2xl font-bold">Create New Task</h1>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold">Title</label>
            <input
              type="text"
              name="title"
              className="border p-2 rounded"
              placeholder="Task title"
              value={taskInput.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold">Description</label>
            <textarea
              name="description"
              className="border p-2 rounded h-24 resize-none"
              placeholder="Task description"
              value={taskInput.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-lg font-semibold">Difficulty</label>
              <select
                name="difficulty"
                className="border p-2 rounded"
                value={taskInput.difficulty}
                onChange={handleInputChange}
                required
              >
                <option value="">Select difficulty</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-semibold">Web Arena Environment</label>
              <input
                type="text"
                name="webArenaEnvironment"
                className="border p-2 rounded"
                placeholder="Enter environment"
                value={taskInput.webArenaEnvironment}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold">Environment Config</label>
            {configEntries.map((entry, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  className="border p-2 w-1/2 rounded"
                  placeholder="Key"
                  value={entry.key}
                  onChange={(e) => handleConfigChange(index, 'key', e.target.value)}
                />
                <input
                  type="text"
                  className="border p-2 w-1/2 rounded"
                  placeholder="Value"
                  value={entry.value}
                  onChange={(e) => handleConfigChange(index, 'value', e.target.value)}
                />
                <button type="button" className="text-red-500 text-xl" onClick={() => handleRemoveConfigEntry(index)}>
                  <AiOutlineDelete />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="flex items-center gap-1 text-blue-500 font-semibold mt-2"
              onClick={handleAddConfigEntry}
            >
              <AiOutlinePlus /> Add Config Entry
            </button>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-500 transition"
          >
            Create Task
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}

export default CreateTask;
