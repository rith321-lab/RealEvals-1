import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiPlay, FiEye, FiList, FiBarChart2, FiInfo, FiCheckCircle, FiClock, FiServer, FiX, FiPlus, FiCpu } from 'react-icons/fi';
import HomeLayout from '../../Layouts/HomeLayout';
import axiosInstance from '../../Helper/axiosInstance';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { useFetchLeaderboard, useFetchSubmissions, useFetchTaskDetail } from '../../hooks/TaskHooks';
import SubmissionList from '../../components/SubmissionList';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Card, CardContent, Badge, Spinner, Table, TableHeader, TableBody, TableRow, TableCell, TableHeaderCell } from '../../components/ui';

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
      <div className="min-h-[90vh] py-12 px-4 md:px-8 lg:px-16 flex flex-col items-center bg-gradient-to-br from-white via-primary-50 to-white animate-fade-in">
        <div className="w-full max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4 text-center animate-slide-up">
            <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">{taskDetail.title}</span>
          </h1>
          
          <p className="text-center text-secondary-600 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {taskDetail.difficulty} difficulty • {taskDetail.webArenaEnvironment || 'Standard'} environment
          </p>

          <div className="flex flex-wrap justify-center gap-2 md:gap-4 border-b border-primary-100 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {[
              { id: 'description', label: 'Description', icon: <FiInfo /> },
              { id: 'testing', label: 'Testing', icon: <FiPlay /> },
              { id: 'submissions', label: 'Submissions', icon: <FiList /> },
              { id: 'leaderboard', label: 'Leaderboard', icon: <FiBarChart2 /> },
              ...(executionResults ? [{ id: 'results', label: 'Results', icon: <FiCheckCircle /> }] : [])
            ].map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-3 md:px-6 md:py-4 transition-all duration-300 rounded-t-lg text-base md:text-lg flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-white text-primary-700 border-b-4 border-primary-600 font-semibold shadow-soft-md'
                    : 'bg-primary-50 text-secondary-600 hover:bg-white hover:text-primary-600'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="w-full animate-slide-up" style={{ animationDelay: '0.3s' }}>
          {activeTab === 'description' && (
            <Card variant="elevated" className="overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-grow space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-secondary-900 mb-4 flex items-center">
                        <FiInfo className="mr-2 text-primary-600" /> Task Details
                      </h2>
                      <div className="prose prose-primary max-w-none">
                        <ReactMarkdown className="text-secondary-700">
                          {taskDetail.description}
                        </ReactMarkdown>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-primary-50 p-4 rounded-lg border border-primary-100">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-secondary-600">Task ID</h3>
                        <p className="font-mono text-secondary-800">{taskDetail.id}</p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-secondary-600">Difficulty</h3>
                        <Badge 
                          variant={
                            taskDetail.difficulty?.toLowerCase() === 'easy' ? 'success' : 
                            taskDetail.difficulty?.toLowerCase() === 'medium' ? 'warning' : 
                            taskDetail.difficulty?.toLowerCase() === 'hard' ? 'danger' : 'primary'
                          }
                        >
                          {taskDetail.difficulty}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-secondary-600">Web Arena Environment</h3>
                        <p className="text-secondary-800">{taskDetail.webArenaEnvironment || 'Standard'}</p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-secondary-600">Created At</h3>
                        <p className="text-secondary-800">
                          {new Date(taskDetail.createdAt || new Date()).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-secondary-900">Environment Configuration</h3>
                      <div className="bg-white p-4 rounded-lg border border-primary-100 space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-secondary-600">Start URL:</span>
                            <p className="text-secondary-800 truncate">
                              {taskDetail.environmentConfig?.startUrl || taskDetail.parameters?.url || 'https://evals-staynb.vercel.app/'}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-secondary-600">Max Steps:</span>
                            <p className="text-secondary-800">{taskDetail.environmentConfig?.maxSteps || '10'}</p>
                          </div>
                          <div>
                            <span className="text-sm text-secondary-600">Timeout:</span>
                            <p className="text-secondary-800">{taskDetail.environmentConfig?.timeoutSeconds || '30'} seconds</p>
                          </div>
                          <div>
                            <span className="text-sm text-secondary-600">Created By:</span>
                            <p className="text-secondary-800">{taskDetail.createdBy || 'System'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-center">
                  <Button
                    onClick={executeTask}
                    disabled={isExecuting}
                    isLoading={isExecuting}
                    size="lg"
                    leftIcon={<FiPlay />}
                  >
                    {isExecuting ? 'Executing...' : 'Execute Task Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'submissions' && (
            <Card variant="elevated">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-primary-100 p-2 rounded-full mr-3">
                    <FiList className="h-5 w-5 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-secondary-900">Submissions</h2>
                </div>
                <SubmissionList submissionsData={submissions} />
              </CardContent>
            </Card>
          )}

          {activeTab === 'testing' && (
            <Card variant="elevated">
              <CardContent className="p-6 md:p-8 text-center">
                {!fillAgentDetail ? (
                  <div className="py-8">
                    <div className="bg-primary-100 p-4 rounded-full inline-flex mb-4">
                      <FiCpu className="h-8 w-8 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-secondary-900 mb-3">Test with Your Agent</h2>
                    <p className="text-secondary-600 mb-6 max-w-lg mx-auto">
                      Add your AI agent to evaluate its performance on this task. You'll be able to track results and compare with other agents.
                    </p>
                    <Button
                      onClick={() => setFillAgentDetail(true)}
                      size="lg"
                      leftIcon={<FiPlus />}
                    >
                      Add Agent
                    </Button>
                  </div>
                ) : (
                  <div className="max-w-lg mx-auto">
                    <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center justify-center">
                      <FiCpu className="mr-2 text-primary-600" /> Create Agent
                    </h2>
                    
                    <div className="space-y-4">
                      <Input
                        label="Agent Name"
                        name="name"
                        placeholder="Enter a unique name for your agent"
                        value={agentDetail.name}
                        onChange={(e) => setAgentDetail({ ...agentDetail, name: e.target.value })}
                        required
                      />
                      
                      <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium text-secondary-700">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-secondary-800 resize-none"
                          placeholder="Describe your agent's capabilities and approach"
                          value={agentDetail.description}
                          onChange={(e) => setAgentDetail({ ...agentDetail, description: e.target.value })}
                          required
                        />
                      </div>
                      
                      <Input
                        label="Accuracy"
                        name="accuracy"
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        placeholder="Expected accuracy (0-1)"
                        value={agentDetail.accuracy}
                        onChange={(e) => setAgentDetail({ ...agentDetail, accuracy: e.target.value })}
                        helperText="Enter a value between 0 and 1, e.g. 0.85 for 85% accuracy"
                        required
                      />
                      
                      <Input
                        label="Configuration Type"
                        name="configurationType"
                        placeholder="e.g., GPT-4, Claude, Custom"
                        value={agentDetail.configurationJson.type}
                        onChange={(e) =>
                          setAgentDetail({
                            ...agentDetail,
                            configurationJson: { ...agentDetail.configurationJson, type: e.target.value },
                          })
                        }
                        required
                      />
                      
                      <div className="flex gap-3 pt-4">
                        <Button
                          variant="secondary"
                          className="flex-1"
                          onClick={() => setFillAgentDetail(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="flex-1"
                          onClick={handleAgentSubmit}
                        >
                          Submit Agent
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'results' && executionResults && (
            <Card variant="elevated">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-primary-100 p-2 rounded-full mr-3">
                    <FiCheckCircle className="h-5 w-5 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-secondary-900">Execution Results</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card variant="flat" className="bg-primary-50">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium text-secondary-600 mb-1">Status</h3>
                      <div className="flex items-center">
                        {executionResults.status === 'success' ? (
                          <>
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-700 rounded-full mr-2">
                              <FiCheckCircle className="h-4 w-4" />
                            </span>
                            <span className="text-lg font-semibold text-green-700">Success</span>
                          </>
                        ) : (
                          <>
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-700 rounded-full mr-2">
                              <FiX className="h-4 w-4" />
                            </span>
                            <span className="text-lg font-semibold text-red-700">Failed</span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card variant="flat" className="bg-primary-50">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium text-secondary-600 mb-1">Execution Time</h3>
                      <div className="flex items-center">
                        <FiClock className="h-5 w-5 text-primary-600 mr-2" />
                        <span className="text-lg font-semibold text-primary-700">{executionResults.executionTime}s</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* BrowserUse API Live Viewer Button */}
                {browserUseTaskId && (
                  <Card variant="flat" className="bg-blue-50 border border-blue-200 mb-6">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h3 className="text-blue-800 font-medium flex items-center">
                            <FiServer className="mr-2" /> Browser automation in progress
                          </h3>
                          <p className="text-sm text-blue-600 mt-1">Task ID: {browserUseTaskId}</p>
                        </div>
                        <Button
                          onClick={openLiveViewer}
                          variant="secondary"
                          leftIcon={<FiEye />}
                          className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                        >
                          Open Live Viewer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {executionResults.results && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
                      <FiList className="mr-2 text-primary-600" /> Steps Executed
                    </h3>
                    
                    <div className="space-y-3">
                      {executionResults.results.steps.map((step, index) => (
                        <Card key={index} variant="flat" className="bg-white border border-primary-100">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-grow">
                                <div className="flex items-center">
                                  <Badge 
                                    variant={step.success ? 'success' : 'danger'}
                                    className="mr-2"
                                  >
                                    {index + 1}
                                  </Badge>
                                  <span className="font-medium text-secondary-800">{step.action}</span>
                                </div>
                                <p className="text-secondary-600 text-sm mt-2">{step.details}</p>
                              </div>
                              <div className="flex items-center ml-4">
                                <span className={`text-sm font-medium ${step.success ? 'text-green-600' : 'text-red-500'}`}>
                                  {step.success ? 'Success' : 'Failed'}
                                </span>
                                <span className="text-xs text-secondary-500 ml-2">
                                  ({step.time}s)
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="mt-4 bg-primary-50 p-3 rounded-lg border border-primary-100">
                      <p className="text-secondary-700 text-sm">
                        <span className="font-medium">Session ID:</span>{' '}
                        <span className="font-mono">{executionResults.results.sessionId}</span>
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'leaderboard' && (
            <Card variant="elevated">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-primary-100 p-2 rounded-full mr-3">
                    <FiBarChart2 className="h-5 w-5 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-secondary-900">Agent Leaderboard</h2>
                </div>
                
                {leaderboard?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHeaderCell className="w-16 text-center">Rank</TableHeaderCell>
                        <TableHeaderCell>Agent Name</TableHeaderCell>
                        <TableHeaderCell className="w-32">Score</TableHeaderCell>
                        <TableHeaderCell className="w-32">Time</TableHeaderCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboard?.map((entry, index) => (
                        <TableRow key={index} isHoverable={true}>
                          <TableCell className="text-center font-semibold">
                            {index === 0 ? (
                              <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-800 rounded-full">
                                1
                              </span>
                            ) : index === 1 ? (
                              <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-700 rounded-full">
                                2
                              </span>
                            ) : index === 2 ? (
                              <span className="inline-flex items-center justify-center w-8 h-8 bg-amber-100 text-amber-800 rounded-full">
                                3
                              </span>
                            ) : (
                              entry.rank
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{entry.agentName}</TableCell>
                          <TableCell>
                            <Badge variant={index === 0 ? 'success' : 'primary'}>
                              {(entry.accuracy * 100).toFixed(2)}%
                            </Badge>
                          </TableCell>
                          <TableCell className="flex items-center">
                            <FiClock className="mr-1 text-secondary-500" />
                            {entry.timeTaken.toFixed(2)}s
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 bg-primary-50 rounded-lg">
                    <div className="bg-white p-3 rounded-full inline-flex mb-3 shadow-soft-sm">
                      <FiBarChart2 className="h-6 w-6 text-secondary-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-secondary-800 mb-2">No results yet</h3>
                    <p className="text-secondary-600 max-w-md mx-auto">
                      Submit an agent to see it appear on the leaderboard. The leaderboard ranks agents based on accuracy and completion time.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default TaskDetails;
