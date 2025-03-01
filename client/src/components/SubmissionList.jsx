import React from 'react';

const SubmissionList = ({ submissionsData }) => {
  const length = submissionsData.items.length;
  if (!submissionsData?.items || submissionsData.items.length === 0) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-yellow-500 mb-4">My Submissions</h2>
        <p className="text-gray-400">No submissions yet.</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-500';
      case 'PROCESSING':
      case 'QUEUE':
        return 'text-yellow-500';
      case 'FAILED':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-yellow-500 mb-4">My Submissions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead>
            <tr className="text-gray-300 border-b border-gray-700">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Score</th>
              <th className="px-4 py-2">Accuracy</th>
              <th className="px-4 py-2">Time Taken</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {submissionsData.items.slice().map((submission, index) => (
              <tr key={submission.id} className="border-b border-gray-700 text-gray-200">
                <td className="px-4 py-2 text-center">{length - index}</td>
                <td className={`px-4 py-2 font-semibold ${getStatusColor(submission.status)}`}>{submission.status}</td>
                <td className="px-4 py-2 text-center">{submission.result?.score.toFixed(2)}</td>
                <td className="px-4 py-2 text-center">{(submission.result?.accuracy * 100).toFixed(2)}%</td>
                <td className="px-4 py-2 text-center">{submission.result?.timeTaken.toFixed(2)}s</td>
                <td className="px-4 py-2 text-center">
                  {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmissionList;
