import { useEffect, useState } from 'react';
import axiosInstance from '../Helper/axiosInstance';
import toast from 'react-hot-toast';

export const useFetchLeaderboard = ({ taskId }) => {
  const [leaderboard, setLeaderboard] = useState([]);

  const fetchLeaderboard = async () => {
    if (!taskId) return;

    try {
      const { data } = await axiosInstance.get(`/submissions/leaderboard/${taskId}`);
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to fetch leaderboard data');
      setLeaderboard([]);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [taskId]);

  return { leaderboard, fetchLeaderboard };
};

export const useFetchTaskDetail = (taskId) => {
  const [taskDetail, setTaskDetail] = useState(null);

  const fetchTaskDetail = async () => {
    if (!taskId) return;

    try {
      const { data } = await axiosInstance.get(`/tasks/${taskId}`);
      setTaskDetail(data);
    } catch (error) {
      console.error('Error fetching task details:', error);
      toast.error('Failed to fetch task details');
      setTaskDetail(null);
    }
  };

  useEffect(() => {
    fetchTaskDetail();
  }, [taskId]);

  return { taskDetail, fetchTaskDetail };
};

export const useFetchSubmissions = (taskId) => {
  const [submissions, setSubmissions] = useState([]);

  const fetchSubmissions = async () => {
    if (!taskId) return;

    try {
      const { data } = await axiosInstance.get(`/submissions/task/${taskId}`);
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to fetch submissions');
      setSubmissions([]);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [taskId]);

  return { submissions, fetchSubmissions };
};
