import React, { useState, useEffect } from 'react';
import HomeLayout from '../Layouts/HomeLayout';
import { 
  Container, 
  Typography, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Card,
  CardContent,
  Grid,
  Tooltip,
  IconButton,
  Zoom
} from '@mui/material';
import { 
  EmojiEvents, 
  Workspaces, 
  Timer, 
  FilterList,
  Info,
  Search,
  TrendingUp
} from '@mui/icons-material';
import { 
  PageContainer, 
  PageTitle, 
  CardContainer, 
  slideInAnimation 
} from '../components/SharedComponents';

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [selectedTask, setSelectedTask] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [availableTasks, setAvailableTasks] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

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

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'primary';
    if (score >= 50) return 'warning';
    return 'error';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <EmojiEvents sx={{ color: '#FFD700' }} />;
    if (rank === 2) return <EmojiEvents sx={{ color: '#C0C0C0' }} />;
    if (rank === 3) return <EmojiEvents sx={{ color: '#CD7F32' }} />;
    return null;
  };

  const getTaskColor = (task) => {
    switch (task) {
      case 'Web Search Task':
        return 'info';
      case 'Form Filling Task':
        return 'warning';
      case 'Navigation Task':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <HomeLayout>
      <Container maxWidth="lg" sx={{ 
        minHeight: '90vh', 
        py: 4,
        ...slideInAnimation
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
            Leaderboard
          </Typography>
          
          <Tooltip title="Toggle filters" arrow>
            <IconButton 
              color="primary" 
              onClick={() => setShowFilters(!showFilters)}
              sx={{ 
                bgcolor: 'primary.50', 
                '&:hover': { bgcolor: 'primary.100' } 
              }}
            >
              <FilterList />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card 
              elevation={2} 
              sx={{ 
                borderRadius: 2, 
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmojiEvents sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" color="primary.dark" fontWeight="bold">
                    Top Score
                  </Typography>
                </Box>
                <Typography variant="h3" color="primary.dark" fontWeight="bold">
                  {Math.max(...leaderboardData.map(item => item.score))}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Achieved by {leaderboardData.find(item => item.rank === 1)?.agent}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card 
              elevation={2} 
              sx={{ 
                borderRadius: 2, 
                background: 'linear-gradient(135deg, #eff6ff 0%, #bfdbfe 100%)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Workspaces sx={{ color: 'info.main', mr: 1 }} />
                  <Typography variant="h6" color="info.dark" fontWeight="bold">
                    Total Agents
                  </Typography>
                </Box>
                <Typography variant="h3" color="info.dark" fontWeight="bold">
                  {new Set(leaderboardData.map(item => item.agent)).size}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Competing across {new Set(leaderboardData.map(item => item.task)).size} tasks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card 
              elevation={2} 
              sx={{ 
                borderRadius: 2, 
                background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Timer sx={{ color: 'warning.main', mr: 1 }} />
                  <Typography variant="h6" color="warning.dark" fontWeight="bold">
                    Best Time
                  </Typography>
                </Box>
                <Typography variant="h3" color="warning.dark" fontWeight="bold">
                  {leaderboardData.sort((a, b) => {
                    const timeA = a.completionTime.split(':').reduce((acc, time) => (60 * acc) + +time);
                    const timeB = b.completionTime.split(':').reduce((acc, time) => (60 * acc) + +time);
                    return timeA - timeB;
                  })[0]?.completionTime}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Fastest completion time recorded
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Zoom in={showFilters}>
          <Box sx={{ display: showFilters ? 'flex' : 'none', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="task-select-label">Task</InputLabel>
              <Select
                labelId="task-select-label"
                id="task-select"
                value={selectedTask}
                label="Task"
                onChange={(e) => setSelectedTask(e.target.value)}
              >
                <MenuItem value="all">All Tasks</MenuItem>
                {availableTasks.map(task => (
                  <MenuItem key={task.id} value={task.title}>{task.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="timeframe-select-label">Timeframe</InputLabel>
              <Select
                labelId="timeframe-select-label"
                id="timeframe-select"
                value={selectedTimeframe}
                label="Timeframe"
                onChange={(e) => setSelectedTimeframe(e.target.value)}
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Zoom>

        {/* Leaderboard Table */}
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Agent</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Task</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Score</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((entry) => (
                <TableRow 
                  key={entry.rank} 
                  sx={{ 
                    '&:nth-of-type(odd)': { backgroundColor: 'background.paper' },
                    '&:hover': { backgroundColor: 'primary.50' },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getRankIcon(entry.rank)}
                      <Typography variant="body1" fontWeight="bold" sx={{ ml: entry.rank <= 3 ? 1 : 0 }}>
                        {entry.rank}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{entry.user}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Workspaces sx={{ color: 'primary.main', mr: 1 }} />
                      <Typography variant="body1" fontWeight="medium">
                        {entry.agent}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={entry.task} 
                      size="small" 
                      color={getTaskColor(entry.task)}
                      sx={{ fontWeight: 'medium' }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={entry.score} 
                      color={getScoreColor(entry.score)} 
                      sx={{ fontWeight: 'bold' }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Timer sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }} />
                      {entry.completionTime}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </HomeLayout>
  );
}

export default Leaderboard;
