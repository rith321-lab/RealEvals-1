import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  CardContainer, 
  PageContainer, 
  PageTitle, 
  FormField, 
  LoadingButton 
} from '../../components/SharedComponents';

const AddTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    difficulty: 'MEDIUM',
    category: 'WEB',
    points: 100
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({
      ...taskData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAlert({
        open: true,
        message: 'Task added successfully!',
        severity: 'success'
      });
      
      // Navigate back to tasks list after success
      setTimeout(() => {
        navigate('/tasks');
      }, 1500);
    } catch (error) {
      setAlert({
        open: true,
        message: error.message || 'Failed to add task',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <PageContainer>
      <Container maxWidth="md">
        <PageTitle>Add New Task</PageTitle>
        
        <CardContainer>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormField
                  required
                  fullWidth
                  id="title"
                  label="Task Title"
                  name="title"
                  value={taskData.title}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormField
                  required
                  fullWidth
                  id="description"
                  label="Task Description"
                  name="description"
                  multiline
                  rows={4}
                  value={taskData.description}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="difficulty-label">Difficulty</InputLabel>
                  <Select
                    labelId="difficulty-label"
                    id="difficulty"
                    name="difficulty"
                    value={taskData.difficulty}
                    label="Difficulty"
                    onChange={handleChange}
                  >
                    <MenuItem value="EASY">Easy</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HARD">Hard</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    value={taskData.category}
                    label="Category"
                    onChange={handleChange}
                  >
                    <MenuItem value="WEB">Web</MenuItem>
                    <MenuItem value="API">API</MenuItem>
                    <MenuItem value="AUTOMATION">Automation</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormField
                  required
                  fullWidth
                  id="points"
                  label="Points"
                  name="points"
                  type="number"
                  InputProps={{ inputProps: { min: 1, max: 1000 } }}
                  value={taskData.points}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button 
                  variant="outlined" 
                  color="secondary"
                  onClick={() => navigate('/tasks')}
                >
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={loading}
                >
                  Add Task
                </LoadingButton>
              </Grid>
            </Grid>
          </Box>
        </CardContainer>
      </Container>
      
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default AddTask;
