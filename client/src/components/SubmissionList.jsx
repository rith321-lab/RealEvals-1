import React from 'react';
import { FiClock, FiCheckCircle, FiAlertCircle, FiActivity, FiList, FiBarChart2 } from 'react-icons/fi';
import { Card, CardContent, Table, TableHeader, TableBody, TableRow, TableCell, TableHeaderCell, Badge, Spinner } from '../components/ui';

const SubmissionList = ({ submissionsData }) => {
  const length = submissionsData?.items?.length || 0;
  
  if (!submissionsData?.items || submissionsData.items.length === 0) {
    return (
      <Card variant="elevated" className="animate-slide-up">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <div className="bg-primary-100 p-2 rounded-full mr-3">
              <FiList className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-xl font-bold text-secondary-900">My Submissions</h2>
          </div>
          
          <div className="text-center py-12 bg-primary-50 rounded-lg">
            <div className="bg-white p-3 rounded-full inline-flex mb-3 shadow-soft-sm">
              <FiList className="h-6 w-6 text-secondary-400" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-800 mb-2">No submissions yet</h3>
            <p className="text-secondary-600 max-w-md mx-auto">
              Submit an agent to see your submissions history here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Helper function to get badge variant based on status
  const getStatusBadgeVariant = (status) => {
    if (!status) return 'secondary';
    const upperStatus = status.toUpperCase();
    if (upperStatus === 'COMPLETED') return 'success';
    if (upperStatus === 'PROCESSING' || upperStatus === 'QUEUE') return 'warning';
    if (upperStatus === 'FAILED') return 'danger';
    return 'secondary';
  };

  // Helper function to get icon based on status
  const getStatusIcon = (status) => {
    if (!status) return <FiActivity />;
    const upperStatus = status.toUpperCase();
    if (upperStatus === 'COMPLETED') return <FiCheckCircle />;
    if (upperStatus === 'PROCESSING' || upperStatus === 'QUEUE') return <FiActivity className="animate-pulse" />;
    if (upperStatus === 'FAILED') return <FiAlertCircle />;
    return <FiActivity />;
  };

  return (
    <Card variant="elevated" className="animate-slide-up">
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <div className="bg-primary-100 p-2 rounded-full mr-3">
            <FiList className="h-5 w-5 text-primary-600" />
          </div>
          <h2 className="text-xl font-bold text-secondary-900">My Submissions</h2>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell className="w-16 text-center">#</TableHeaderCell>
              <TableHeaderCell className="w-32">Status</TableHeaderCell>
              <TableHeaderCell className="w-24 text-center">Score</TableHeaderCell>
              <TableHeaderCell className="w-24 text-center">Accuracy</TableHeaderCell>
              <TableHeaderCell className="w-32 text-center">Time Taken</TableHeaderCell>
              <TableHeaderCell>Submitted At</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissionsData.items.slice().map((submission, index) => (
              <TableRow key={submission.id} isHoverable={true}>
                <TableCell className="text-center font-semibold">
                  {length - index}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={getStatusBadgeVariant(submission.status)}
                    className="flex items-center gap-1 w-fit"
                  >
                    {getStatusIcon(submission.status)}
                    {submission.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    <FiBarChart2 className="mr-1 text-primary-500" />
                    {submission.result?.score ? submission.result.score.toFixed(2) : 'N/A'}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={
                    !submission.result?.accuracy ? 'secondary' :
                    submission.result.accuracy >= 0.8 ? 'success' :
                    submission.result.accuracy >= 0.5 ? 'warning' : 'danger'
                  }>
                    {submission.result?.accuracy ? `${(submission.result.accuracy * 100).toFixed(2)}%` : 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    <FiClock className="mr-1 text-secondary-500" />
                    {submission.result?.timeTaken ? `${submission.result.timeTaken.toFixed(2)}s` : 'N/A'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <FiClock className="mr-2 text-secondary-500" />
                    {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }) : 'N/A'}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SubmissionList;
