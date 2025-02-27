import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HomeLayout from '../../Layouts/HomeLayout';
import axiosInstance from '../../Helper/axiosInstance';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { useFetchLeaderboard, useFetchSubmissions, useFetchTaskDetail } from '../../hooks/taskHooks';

function TaskDetails() {
  const [activeTab, setActiveTab] = useState('description');
  const [fillAgentDetail, setFillAgentDetail] = useState(false);
  const [agentDetail, setAgentDetail] = useState({
    name: '',
    description: '',
    accuracy: '',
    configurationJson: {
      type: '',
      parameters: {},
    },
  });

  const { taskId } = useParams();
  const { taskDetail, fetchTaskDetail } = useFetchTaskDetail(taskId);
  const { submissions: mySubmissions, fetchSubmissions } = useFetchSubmissions(taskId);
  const { leaderboard } = useFetchLeaderboard({ taskId });

  console.log(leaderboard);

  const handleAgentSubmit = async () => {
    if (!agentDetail.name || !agentDetail.description || !agentDetail.accuracy) {
      toast.error('All fields are required!');
      return;
    }
    try {
      const { data } = await axiosInstance.post('/agents', agentDetail);
      toast.success('Agent created successfully!');
      if (data?.id) {
        const submissionData = await axiosInstance.post('/submissions', { agentId: data.id, taskId });
        console.log(submissionData);
        toast.success('Submitted for testing!');
        setFillAgentDetail(false);
        setActiveTab('submissions');
      }
    } catch (error) {
      toast.error('Submission failed!');
    }
  };

  if (!taskDetail) {
    return (
      <HomeLayout>
        <div className="min-h-[90vh] flex items-center justify-center text-white">
          <p>Loading task details...</p>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-12 px-20 flex flex-col items-center text-white">
        <h1 className="text-5xl font-bold text-yellow-500 mb-8 text-center">{taskDetail.title}</h1>

        <div className="flex space-x-12 border-b-4 border-gray-700 mb-8 text-xl font-semibold">
          {['description', 'testing', 'submissions', 'leaderboard'].map((tab) => (
            <button
              key={tab}
              className={`px-8 py-4 transition-all duration-300 rounded-t-lg shadow-md text-lg ${
                activeTab === tab
                  ? 'bg-yellow-500 text-black border-b-4 border-yellow-500'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="w-full max-w-5xl">
          {activeTab === 'description' && (
            <div className="bg-gray-900 p-8 rounded-lg shadow-lg text-gray-300 text-lg leading-relaxed">
              <h2 className="text-3xl font-semibold text-yellow-500 mb-4">Task Details</h2>
              <ReactMarkdown>
                {`**ID:** ${taskDetail.id}\n\n**Title:** ${taskDetail.title}\n\n**Description:** ${taskDetail.description}\n\n**Difficulty:** ${taskDetail.difficulty}\n\n**Web Arena Environment:** ${taskDetail.webArenaEnvironment}\n\n**Environment Config:**\n- Start URL: ${taskDetail.environmentConfig.startUrl}\n- Max Steps: ${taskDetail.environmentConfig.maxSteps}\n- Timeout Seconds: ${taskDetail.environmentConfig.timeoutSeconds}\n\n**Created At:** ${taskDetail.createdAt}\n\n**Created By:** ${taskDetail.createdBy}`}
              </ReactMarkdown>
            </div>
          )}

          {activeTab === 'submissions' && (
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-yellow-500 mb-4">My Submissions</h2>
              {mySubmissions.length === 0 ? (
                <p className="text-gray-400">No submissions yet.</p>
              ) : (
                <ul className="space-y-4">
                  {/* {mySubmissions.map((submission, index) => (
                    <li key={index} className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-lg font-semibold">Agent: {submission.agentName}</p>
                      <p className="text-gray-300">Status: {submission.status}</p>
                      <p className="text-gray-400 text-sm">
                        Submitted at: {new Date(submission.createdAt).toLocaleString()}
                      </p>
                    </li>
                  ))} */}
                </ul>
              )}
            </div>
          )}

          {activeTab === 'testing' && (
            <div className="text-center bg-gray-900 p-6 rounded-lg shadow-lg">
              {!fillAgentDetail ? (
                <button
                  onClick={() => setFillAgentDetail(true)}
                  className="bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-600 text-lg font-bold"
                >
                  Add Agent
                </button>
              ) : (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
                  <h2 className="text-xl font-semibold text-yellow-500 mb-4">Create Agent</h2>
                  <input
                    name="name"
                    placeholder="Agent Name"
                    className="w-full p-3 mb-3 bg-gray-700 text-white rounded"
                    onChange={(e) => setAgentDetail({ ...agentDetail, name: e.target.value })}
                  />
                  <input
                    name="description"
                    placeholder="Description"
                    className="w-full p-3 mb-3 bg-gray-700 text-white rounded"
                    onChange={(e) => setAgentDetail({ ...agentDetail, description: e.target.value })}
                  />
                  <input
                    name="accuracy"
                    placeholder="Accuracy"
                    className="w-full p-3 mb-3 bg-gray-700 text-white rounded"
                    onChange={(e) => setAgentDetail({ ...agentDetail, accuracy: e.target.value })}
                  />
                  <input
                    name="configurationType"
                    placeholder="Configuration Type"
                    className="w-full p-3 mb-3 bg-gray-700 text-white rounded"
                    onChange={(e) =>
                      setAgentDetail({
                        ...agentDetail,
                        configurationJson: { ...agentDetail.configurationJson, type: e.target.value },
                      })
                    }
                  />
                  <button
                    onClick={handleAgentSubmit}
                    className="bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-600 text-lg font-bold"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-yellow-500 mb-4">Leaderboard</h2>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-3">Rank</th>
                    <th className="py-3">Agent Name</th>
                    <th className="py-3">Accuracy</th>
                    <th className="py-3">Time Taken</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-800 transition-all duration-300">
                      <td className="py-3">{entry.rank}</td>
                      <td
                        className="py-3 text-yellow-500 cursor-pointer hover:underline"
                        onClick={() => handleAgentClick(entry.agentId)}
                      >
                        {entry.agentName}
                      </td>
                      <td className="py-3">{(entry.accuracy * 100).toFixed(2)}%</td>
                      <td className="py-3">{entry.timeTaken.toFixed(2)}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </HomeLayout>
  );
}

export default TaskDetails;
