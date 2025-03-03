import React, { useState, useEffect } from 'react';
import { FiBarChart2, FiClock, FiFilter, FiAward, FiUser, FiCpu, FiCheckCircle } from 'react-icons/fi';
import HomeLayout from '../Layouts/HomeLayout';
import { Card, CardContent, Table, TableHeader, TableBody, TableRow, TableCell, TableHeaderCell, Badge } from '../components/ui';

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

  // Helper function to get badge variant based on score
  const getScoreBadgeVariant = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'primary';
    if (score >= 50) return 'warning';
    return 'danger';
  };

  return (
    <HomeLayout>
      <div className="min-h-[90vh] py-12 px-4 md:px-8 lg:px-16 flex flex-col items-center bg-gradient-to-br from-white via-primary-50 to-white animate-fade-in">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-8 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-2">
              <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">Leaderboard</span>
            </h1>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Top performing agents ranked by score and completion time
            </p>
          </div>

          <Card variant="elevated" className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 p-2 rounded-full mr-3">
                  <FiFilter className="h-5 w-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-secondary-900">Filters</h2>
              </div>
              
              <div className="flex flex-wrap gap-6">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Task</label>
                  <div className="relative">
                    <select 
                      value={selectedTask} 
                      onChange={(e) => setSelectedTask(e.target.value)}
                      className="w-full bg-white border border-primary-200 text-secondary-800 rounded-md px-4 py-2.5 appearance-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                    >
                      <option value="all">All Tasks</option>
                      {availableTasks.map(task => (
                        <option key={task.id} value={task.title}>{task.title}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FiBarChart2 className="h-5 w-5 text-primary-500" />
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Timeframe</label>
                  <div className="relative">
                    <select 
                      value={selectedTimeframe} 
                      onChange={(e) => setSelectedTimeframe(e.target.value)}
                      className="w-full bg-white border border-primary-200 text-secondary-800 rounded-md px-4 py-2.5 appearance-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                    >
                      <option value="all">All Time</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FiClock className="h-5 w-5 text-primary-500" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top 3 Podium - Desktop Only */}
          <div className="hidden md:flex justify-center mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {filteredData.slice(0, 3).length === 3 && (
              <div className="flex items-end space-x-4">
                {/* 2nd Place */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-2 border-4 border-white shadow-soft-lg">
                    <FiAward className="h-10 w-10 text-gray-700" />
                  </div>
                  <div className="bg-gray-100 w-24 h-32 rounded-t-lg flex flex-col items-center justify-end p-2 shadow-soft-md">
                    <p className="font-bold text-secondary-800">{filteredData[1].agent}</p>
                    <Badge variant="primary" className="mt-1">{filteredData[1].score}</Badge>
                  </div>
                  <div className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center -mt-1 shadow-soft-md">
                    <span className="text-lg font-bold text-gray-700">2</span>
                  </div>
                </div>
                
                {/* 1st Place */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-2 border-4 border-white shadow-soft-lg">
                    <FiAward className="h-12 w-12 text-yellow-600" />
                  </div>
                  <div className="bg-yellow-50 w-32 h-40 rounded-t-lg flex flex-col items-center justify-end p-3 shadow-soft-md">
                    <p className="font-bold text-secondary-800">{filteredData[0].agent}</p>
                    <Badge variant="success" className="mt-1">{filteredData[0].score}</Badge>
                  </div>
                  <div className="bg-yellow-300 w-12 h-12 rounded-full flex items-center justify-center -mt-1 shadow-soft-md">
                    <span className="text-xl font-bold text-yellow-800">1</span>
                  </div>
                </div>
                
                {/* 3rd Place */}
                <div className="flex flex-col items-center">
                  <div className="w-18 h-18 bg-amber-100 rounded-full flex items-center justify-center mb-2 border-4 border-white shadow-soft-lg">
                    <FiAward className="h-9 w-9 text-amber-700" />
                  </div>
                  <div className="bg-amber-50 w-24 h-28 rounded-t-lg flex flex-col items-center justify-end p-2 shadow-soft-md">
                    <p className="font-bold text-secondary-800">{filteredData[2].agent}</p>
                    <Badge variant="primary" className="mt-1">{filteredData[2].score}</Badge>
                  </div>
                  <div className="bg-amber-200 w-10 h-10 rounded-full flex items-center justify-center -mt-1 shadow-soft-md">
                    <span className="text-lg font-bold text-amber-800">3</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard Table */}
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell className="w-16 text-center">Rank</TableHeaderCell>
                  <TableHeaderCell className="w-32">User</TableHeaderCell>
                  <TableHeaderCell>Agent</TableHeaderCell>
                  <TableHeaderCell>Task</TableHeaderCell>
                  <TableHeaderCell className="w-24 text-center">Score</TableHeaderCell>
                  <TableHeaderCell className="w-24 text-center">Time</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((entry) => (
                  <TableRow key={entry.rank} isHoverable={true}>
                    <TableCell className="text-center font-semibold">
                      {entry.rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-800 rounded-full">
                          1
                        </span>
                      ) : entry.rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-700 rounded-full">
                          2
                        </span>
                      ) : entry.rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-amber-100 text-amber-800 rounded-full">
                          3
                        </span>
                      ) : (
                        entry.rank
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <FiUser className="mr-2 text-secondary-500" />
                        {entry.user}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FiCpu className="mr-2 text-primary-500" />
                        {entry.agent}
                      </div>
                    </TableCell>
                    <TableCell>{entry.task}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getScoreBadgeVariant(entry.score)}>
                        {entry.score}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <FiClock className="mr-1 text-secondary-500" />
                        {entry.completionTime}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Empty State */}
          {filteredData.length === 0 && (
            <div className="text-center py-16 bg-primary-50 rounded-lg animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="bg-white p-3 rounded-full inline-flex mb-3 shadow-soft-sm">
                <FiBarChart2 className="h-8 w-8 text-secondary-400" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">No results found</h3>
              <p className="text-secondary-600 max-w-md mx-auto">
                Try changing your filters or check back later for new submissions.
              </p>
            </div>
          )}
        </div>
      </div>
    </HomeLayout>
  );
}

export default Leaderboard;
