import React from 'react';
import { 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Box, 
  Chip 
} from '@mui/material';
import { CheckCircle, Error, HourglassEmpty, AccessTime } from '@mui/icons-material';

const SubmissionList = ({ submissionsData }) => {
  const length = submissionsData?.items?.length || 0;
  
  if (!submissionsData?.items || submissionsData.items.length === 0) {
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 2, 
          bgcolor: 'background.paper',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        <Typography variant="h6" color="primary" fontWeight="bold" mb={2}>
          My Submissions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No submissions yet.
        </Typography>
      </Paper>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle color="success" />;
      case 'PROCESSING':
      case 'QUEUE':
        return <HourglassEmpty color="warning" />;
      case 'FAILED':
        return <Error color="error" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PROCESSING':
      case 'QUEUE':
        return 'warning';
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 2, 
        bgcolor: 'background.paper',
        border: '1px solid rgba(255, 255, 255, 0.12)'
      }}
    >
      <Typography variant="h6" color="primary" fontWeight="bold" mb={3}>
        My Submissions
      </Typography>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>#</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Score</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Accuracy</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Time Taken</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissionsData.items.slice().map((submission, index) => (
              <TableRow 
                key={submission.id} 
                sx={{ 
                  '&:nth-of-type(odd)': { backgroundColor: 'background.paper' },
                  '&:hover': { backgroundColor: 'primary.50' },
                  transition: 'background-color 0.2s'
                }}
              >
                <TableCell align="center">{length - index}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getStatusIcon(submission.status)}
                    <Chip 
                      label={submission.status} 
                      color={getStatusColor(submission.status)} 
                      size="small"
                      sx={{ fontWeight: 'medium' }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="center">
                  {submission.result?.score ? (
                    <Typography variant="body2" fontWeight="medium">
                      {submission.result.score.toFixed(2)}
                    </Typography>
                  ) : '-'}
                </TableCell>
                <TableCell align="center">
                  {submission.result?.accuracy ? (
                    <Typography variant="body2" fontWeight="medium">
                      {(submission.result.accuracy * 100).toFixed(2)}%
                    </Typography>
                  ) : '-'}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="body2">
                      {submission.result?.timeTaken ? `${submission.result.timeTaken.toFixed(2)}s` : '-'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  {submission.submittedAt ? (
                    new Date(submission.submittedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  ) : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SubmissionList;
