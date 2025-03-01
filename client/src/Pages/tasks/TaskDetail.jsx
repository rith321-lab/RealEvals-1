import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HomeLayout from '../../Layouts/HomeLayout';
import axiosInstance from '../../Helper/axiosInstance';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { useFetchLeaderboard, useFetchSubmissions, useFetchTaskDetail } from '../../hooks/TaskHooks';
import SubmissionList from '../../components/SubmissionList';
import { useQueryClient } from '@tanstack/react-query';

function TaskDetails() {
  const queryClient = useQueryClient();
  const { taskId } = useParams();
  const [activeTab, setActiveTab] = useState('description');
  const [fillAgentDetail, setFillAgentDetail] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState(null);
  const [browserUseTaskId, setBrowserUseTaskId] = useState(null);
  const [liveViewerOpened, setLiveViewerOpened] = useState(false);
  const [agentDetail, setAgentDetail] = useState({
    name: '',
    description: '',
    accuracy: '',
    configurationJson: {
      type: '',
      parameters: {},
    },
  });

  const taskDetail = useFetchTaskDetail(taskId);
  const submissions = useFetchSubmissions(taskId);
  const leaderboard = useFetchLeaderboard(taskId);

  const handleAgentSubmit = async () => {
    if (!agentDetail.name || !agentDetail.description || !agentDetail.accuracy) {
      toast.error('All fields are required!');
      return;
    }

    try {
      const { data } = await axiosInstance.post('/agents', agentDetail);
      toast.success('Agent created successfully!');

      if (data?.id) {
        await axiosInstance.post('/submissions', { agentId: data.id, taskId });
        toast.success('Submitted for testing!');
        setFillAgentDetail(false);
        setActiveTab('submissions');

        queryClient.invalidateQueries(['leaderboard', taskId]);

        queryClient.invalidateQueries(['submissions', taskId]);
      }
    } catch (error) {
      toast.error('Submission failed!');
    }
  };

  const executeTask = async () => {
    if (!taskDetail) return;
    
    try {
      setIsExecuting(true);
      toast.loading('Executing task...', { id: 'executing' });
      
      // Call the backend API
      const response = await axiosInstance.post('/tasks/execute', {
        taskId: taskId,
        parameters: taskDetail.parameters || {},
        browserUseConfig: taskDetail.browserUseConfig || {
          url: taskDetail.browserUseConfig?.startUrl || "https://www.google.com",
          timeout: taskDetail.browserUseConfig?.timeoutSeconds || 60,
          maxSteps: taskDetail.browserUseConfig?.maxSteps || 15
        }
      });
      
      toast.dismiss('executing');
      
      if (response.status === 200) {
        toast.success('Task executed successfully!');
        setExecutionResults(response.data);
        
        // Check if BrowserUse task ID is present
        if (response.data.results?.browserUseTaskId) {
          setBrowserUseTaskId(response.data.results.browserUseTaskId);
          setLiveViewerOpened(response.data.results.liveViewerOpened || false);
          
          // Save the live viewer URL if available
          if (response.data.results.liveViewerUrl) {
            localStorage.setItem('liveViewerUrl', response.data.results.liveViewerUrl);
          }
          
          // If the viewer didn't open automatically, show a message
          if (!response.data.results.liveViewerOpened) {
            toast.success('Task is executing in the browser. Click "Open Live Viewer" to see the progress.');
          }
        }
        
        // Refresh submissions to show the new execution
        queryClient.invalidateQueries(['submissions', taskId]);
        setActiveTab('results');
      } else {
        toast.error('Task execution failed. Please try again.');
      }
    } catch (error) {
      console.error('Task execution error:', error);
      toast.dismiss('executing');
      toast.error('Error executing task: ' + (error.response?.data?.message || 'Server unavailable. Please try again later.'));
    } finally {
      setIsExecuting(false);
    }
  };

  const openLiveViewer = () => {
    if (!browserUseTaskId) {
      toast.error('No browser task ID available');
      return;
    }
    
    // First try to get the URL from the execution results
    let liveViewerUrl = null;
    
    if (executionResults?.results) {
      // Try different URL formats in order of preference
      liveViewerUrl = executionResults.results.liveViewerDirectUrl || 
                      executionResults.results.liveViewerUrl;
    }
    
    // If not found in execution results, try localStorage
    if (!liveViewerUrl) {
      liveViewerUrl = localStorage.getItem('liveViewerUrl');
    }
    
    // If still not found, construct a fallback URL
    if (!liveViewerUrl) {
      // Use the anchorbrowser.io format as fallback
      liveViewerUrl = `https://live.anchorbrowser.io/inspector.html?host=connect.anchorbrowser.io&sessionId=${browserUseTaskId}`;
      console.log('Using fallback URL format:', liveViewerUrl);
    }
    
    // Open the viewer in a new tab
    window.open(liveViewerUrl, '_blank');
    setLiveViewerOpened(true);
    
    // Show toast with instructions
    toast.success('Live viewer opened in a new tab. If it shows a blank screen, the browser session may have ended.');
  };

  if (!taskDetail) {
    return (
      <HomeLayout>
        <div className="min-h-[90vh] flex items-center justify-center text-secondary-800">
          <p>Loading task details...</p>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-12 px-20 flex flex-col items-center text-secondary-800 bg-gradient-to-b from-white to-primary-50">
        <h1 className="text-5xl font-bold text-primary-600 mb-8 text-center">{taskDetail.title}</h1>

        <div className="flex space-x-12 border-b-2 border-primary-100 mb-8 text-xl font-semibold">
          {['description', 'testing', 'submissions', 'leaderboard', ...(executionResults ? ['results'] : [])].map((tab) => (
            <button
              key={tab}
              className={`px-8 py-4 transition-all duration-300 rounded-t-lg shadow-md text-lg ${
                activeTab === tab
                  ? 'bg-gradient-to-b from-primary-100 to-primary-200 text-primary-800 border-b-4 border-primary-400'
                  : 'bg-white text-secondary-600 hover:bg-primary-50 hover:text-primary-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="w-full max-w-5xl">
          {activeTab === 'description' && (
            <div className="bg-white p-8 rounded-lg shadow-lg text-secondary-700 text-lg leading-relaxed border border-primary-100">
              <h2 className="text-3xl font-semibold text-primary-600 mb-4">Task Details</h2>
              <ReactMarkdown>
                {`**ID:** ${taskDetail.id}\n\n**Title:** ${taskDetail.title}\n\n**Description:** ${taskDetail.description}\n\n**Difficulty:** ${taskDetail.difficulty}\n\n**Web Arena Environment:** ${taskDetail.webArenaEnvironment || 'Standard'}\n\n**Environment Config:**\n- Start URL: ${taskDetail.environmentConfig?.startUrl || taskDetail.parameters?.url || 'https://evals-staynb.vercel.app/'}\n- Max Steps: ${taskDetail.environmentConfig?.maxSteps || '10'}\n- Timeout Seconds: ${taskDetail.environmentConfig?.timeoutSeconds || '30'}\n\n**Created At:** ${taskDetail.createdAt || new Date().toISOString()}\n\n**Created By:** ${taskDetail.createdBy || 'System'}`}
              </ReactMarkdown>
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={executeTask}
                  disabled={isExecuting}
                  className={`bg-primary-600 hover:bg-primary-700 text-white py-3 px-8 rounded-lg text-lg font-semibold flex items-center transition-all duration-300 ${isExecuting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isExecuting ? 'Executing...' : 'Execute Task Now'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'submissions' && <SubmissionList submissionsData={submissions} />}

          {activeTab === 'testing' && (
            <div className="text-center bg-white p-6 rounded-lg shadow-lg border border-primary-100">
              {!fillAgentDetail ? (
                <button
                  onClick={() => setFillAgentDetail(true)}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 text-lg font-bold transition-all duration-300"
                >
                  Add Agent
                </button>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg border border-primary-100">
                  <h2 className="text-xl font-semibold text-primary-600 mb-4">Create Agent</h2>
                  <input
                    name="name"
                    placeholder="Agent Name"
                    className="w-full p-3 mb-3 bg-white border border-primary-200 text-secondary-800 rounded focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                    onChange={(e) => setAgentDetail({ ...agentDetail, name: e.target.value })}
                  />
                  <input
                    name="description"
                    placeholder="Description"
                    className="w-full p-3 mb-3 bg-white border border-primary-200 text-secondary-800 rounded focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                    onChange={(e) => setAgentDetail({ ...agentDetail, description: e.target.value })}
                  />
                  <input
                    name="accuracy"
                    placeholder="Accuracy"
                    className="w-full p-3 mb-3 bg-white border border-primary-200 text-secondary-800 rounded focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                    onChange={(e) => setAgentDetail({ ...agentDetail, accuracy: e.target.value })}
                  />
                  <input
                    name="configurationType"
                    placeholder="Configuration Type"
                    className="w-full p-3 mb-3 bg-white border border-primary-200 text-secondary-800 rounded focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                    onChange={(e) =>
                      setAgentDetail({
                        ...agentDetail,
                        configurationJson: { ...agentDetail.configurationJson, type: e.target.value },
                      })
                    }
                  />
                  <button
                    onClick={handleAgentSubmit}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 text-lg font-bold transition-all duration-300"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'results' && executionResults && (
            <div className="bg-white p-6 rounded-lg shadow-lg border border-primary-100">
              <h2 className="text-xl font-semibold text-primary-600 mb-4">Execution Results</h2>
              <div className="bg-gradient-to-r from-white to-primary-50 p-4 rounded-lg border border-primary-100">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-secondary-600">Status:</p>
                    <p className={`text-lg font-semibold ${executionResults.status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                      {executionResults.status === 'success' ? 'Success' : 'Failed'}
                    </p>
                  </div>
                  <div>
                    <p className="text-secondary-600">Execution Time:</p>
                    <p className="text-lg font-semibold text-primary-600">{executionResults.executionTime}s</p>
                  </div>
                </div>
                
                {/* BrowserUse API Live Viewer Button */}
                {browserUseTaskId && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-blue-800 font-medium">Browser automation in progress</p>
                        <p className="text-sm text-blue-600">Task ID: {browserUseTaskId}</p>
                      </div>
                      <button
                        onClick={openLiveViewer}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                      >
                        Open Live Viewer
                      </button>
                    </div>
                  </div>
                )}
                
                {executionResults.results && (
                  <>
                    <h3 className="text-lg font-semibold text-primary-600 mt-4 mb-2">Steps Executed:</h3>
                    <ul className="space-y-2">
                      {executionResults.results.steps.map((step, index) => (
                        <li key={index} className="bg-white p-3 rounded border border-primary-100">
                          <div className="flex justify-between">
                            <span className="font-medium text-secondary-800">{step.action}</span>
                            <span className={step.success ? 'text-green-600' : 'text-red-500'}>
                              {step.success ? 'Success' : 'Failed'} ({step.time}s)
                            </span>
                          </div>
                          <p className="text-secondary-700 text-sm mt-1">{step.details}</p>
                        </li>
                      ))}
                    </ul>
                    
                    <p className="mt-4 text-secondary-700">
                      Session ID: <span className="font-mono text-sm">{executionResults.results.sessionId}</span>
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="bg-white p-6 rounded-lg shadow-lg border border-primary-100">
              <h2 className="text-xl font-semibold text-primary-600 mb-4">Leaderboard</h2>
              <table className="w-full text-left">
                <thead className="bg-primary-50">
                  <tr className="border-b border-primary-100">
                    <th className="py-3 px-4 text-secondary-800">Rank</th>
                    <th className="py-3 px-4 text-secondary-800">Agent Name</th>
                    <th className="py-3 px-4 text-secondary-800">Score</th>
                    <th className="py-3 px-4 text-secondary-800">Time Taken</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard?.map((entry, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-800 transition-all duration-300">
                      <td className="py-3">{entry.rank}</td>
                      <td className="py-3">{entry.agentName}</td>
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
