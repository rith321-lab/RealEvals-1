import React, { useState, useEffect } from 'react';
import HomeLayout from '../Layouts/HomeLayout';

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [selectedTask, setSelectedTask] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [availableTasks, setAvailableTasks] = useState([]);

  useEffect(() => {
    // Simulated data - would be replaced with actual API calls
    const tasks = [
      { id: 1, title: 'Web Search Task' },
      { id: 2, title: 'Form Filling Task' },
      { id: 3, title: 'Navigation Task' }
    ];
    
    setAvailableTasks(tasks);
    
    // Mock leaderboard data
    const mockData = [
      { rank: 1, user: 'user3', agent: 'Navigator Pro', task: 'Navigation Task', score: 95, completionTime: '1:42' },
      { rank: 2, user: 'user1', agent: 'SearchBot v1', task: 'Web Search Task', score: 89, completionTime: '2:15' },
      { rank: 3, user: 'user5', agent: 'BrowseBot', task: 'Navigation Task', score: 87, completionTime: '1:58' },
      { rank: 4, user: 'user7', agent: 'SmartNav', task: 'Web Search Task', score: 83, completionTime: '2:30' },
      { rank: 5, user: 'user9', agent: 'FillerPro', task: 'Form Filling Task', score: 79, completionTime: '3:10' },
      { rank: 6, user: 'user2', agent: 'FormFiller', task: 'Form Filling Task', score: 76, completionTime: '3:22' },
      { rank: 7, user: 'user4', agent: 'DataMiner', task: 'Web Search Task', score: 72, completionTime: '2:45' },
      { rank: 8, user: 'user6', agent: 'AutoBrowse', task: 'Navigation Task', score: 68, completionTime: '2:12' },
      { rank: 9, user: 'user8', agent: 'SearchMaster', task: 'Web Search Task', score: 64, completionTime: '3:05' },
      { rank: 10, user: 'user10', agent: 'FormWizard', task: 'Form Filling Task', score: 61, completionTime: '3:40' }
    ];
    
    setLeaderboardData(mockData);
  }, []);

  const filteredData = leaderboardData.filter(entry => {
    if (selectedTask !== 'all' && entry.task !== selectedTask) return false;
    return true;
  });

  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-12 px-8 md:px-20 flex flex-col">
        <h1 className="text-3xl font-semibold mb-8 text-secondary-800">
          <span className="font-bold text-primary-600">Leaderboard</span>
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div>
            <label className="block text-sm text-secondary-600 mb-1">Task</label>
            <select 
              value={selectedTask} 
              onChange={(e) => setSelectedTask(e.target.value)}
              className="bg-white border border-primary-200 text-secondary-800 rounded-md px-4 py-2 focus:border-primary-400 focus:ring focus:ring-primary-100 transition-all"
            >
              <option value="all">All Tasks</option>
              {availableTasks.map(task => (
                <option key={task.id} value={task.title}>{task.title}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-secondary-600 mb-1">Timeframe</label>
            <select 
              value={selectedTimeframe} 
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-white border border-primary-200 text-secondary-800 rounded-md px-4 py-2 focus:border-primary-400 focus:ring focus:ring-primary-100 transition-all"
            >
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-x-auto rounded-lg border border-primary-200 shadow-md">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-primary-50">
              <tr>
                <th className="py-3 px-4 text-left text-secondary-700 font-semibold">#</th>
                <th className="py-3 px-4 text-left text-secondary-700 font-semibold">User</th>
                <th className="py-3 px-4 text-left text-secondary-700 font-semibold">Agent</th>
                <th className="py-3 px-4 text-left text-secondary-700 font-semibold">Task</th>
                <th className="py-3 px-4 text-left text-secondary-700 font-semibold">Score</th>
                <th className="py-3 px-4 text-left text-secondary-700 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry) => (
                <tr key={entry.rank} className="border-t border-gray-100 hover:bg-primary-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-secondary-800">
                    {entry.rank === 1 && <span className="text-yellow-500">🏆 </span>}
                    {entry.rank === 2 && <span className="text-gray-500">🥈 </span>}
                    {entry.rank === 3 && <span className="text-amber-600">🥉 </span>}
                    {entry.rank}
                  </td>
                  <td className="py-3 px-4 text-secondary-800">{entry.user}</td>
                  <td className="py-3 px-4 font-medium text-secondary-800">{entry.agent}</td>
                  <td className="py-3 px-4 text-secondary-800">{entry.task}</td>
                  <td className="py-3 px-4 font-bold">
                    <span className={
                      entry.score >= 90 ? 'text-green-600' :
                      entry.score >= 70 ? 'text-primary-600' :
                      entry.score >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }>
                      {entry.score}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-secondary-800">{entry.completionTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HomeLayout>
  );
}

export default Leaderboard;
