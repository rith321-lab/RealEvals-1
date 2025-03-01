import json
import time
import uuid
from typing import Dict, List, Any, Optional
import requests
from loguru import logger
from ..models.enums import EvaluationStatus
from ..models.models import EvaluationResult, Submission
from ..core.config import settings

class BrowserUseService:
    """Service for interacting with the Browser Use API for browser automation tasks"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or settings.BROWSER_USE_API_KEY
        self.base_url = 'https://api.browser-use.com/api/v1'
        self.headers = {'Authorization': f'Bearer {self.api_key}'}
    
    def create_task(self, instructions: str, options: Dict[str, Any] = None) -> str:
        """Create a new browser automation task
        
        Args:
            instructions: The instructions for the browser automation task
            options: Optional configuration for the task
            
        Returns:
            str: The task ID
        """
        try:
            payload = {'task': instructions}
            if options:
                payload['options'] = options
                
            response = requests.post(
                f'{self.base_url}/run-task', 
                headers=self.headers, 
                json=payload
            )
            response.raise_for_status()
            return response.json()['id']
        except Exception as e:
            logger.error(f"Error creating Browser Use task: {str(e)}")
            raise
    
    def get_task_status(self, task_id: str) -> Dict[str, Any]:
        """Get current task status
        
        Args:
            task_id: The ID of the task
            
        Returns:
            Dict: The task status
        """
        try:
            response = requests.get(
                f'{self.base_url}/task/{task_id}/status', 
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error getting Browser Use task status: {str(e)}")
            raise
    
    def get_task_details(self, task_id: str) -> Dict[str, Any]:
        """Get full task details including output
        
        Args:
            task_id: The ID of the task
            
        Returns:
            Dict: The task details
        """
        try:
            response = requests.get(
                f'{self.base_url}/task/{task_id}', 
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error getting Browser Use task details: {str(e)}")
            raise
    
    def wait_for_completion(self, task_id: str, poll_interval: int = 2, callback=None) -> Dict[str, Any]:
        """Poll task status until completion
        
        Args:
            task_id: The ID of the task
            poll_interval: The interval in seconds to poll for updates
            callback: Optional callback function to execute on each status update
            
        Returns:
            Dict: The final task details
        """
        unique_steps = []
        while True:
            details = self.get_task_details(task_id)
            new_steps = details.get('steps', [])
            
            # Log new steps
            if new_steps != unique_steps:
                for step in new_steps:
                    if step not in unique_steps:
                        logger.debug(f"Task step: {json.dumps(step)}")
                unique_steps = new_steps
            
            # Execute callback if provided
            if callback and callable(callback):
                callback(details)
            
            status = details.get('status')
            if status in ['finished', 'failed', 'stopped']:
                return details
            
            time.sleep(poll_interval)
    
    def pause_task(self, task_id: str) -> bool:
        """Pause a running task
        
        Args:
            task_id: The ID of the task
            
        Returns:
            bool: Success status
        """
        try:
            response = requests.put(
                f'{self.base_url}/pause-task?task_id={task_id}', 
                headers=self.headers
            )
            response.raise_for_status()
            return True
        except Exception as e:
            logger.error(f"Error pausing Browser Use task: {str(e)}")
            return False
    
    def resume_task(self, task_id: str) -> bool:
        """Resume a paused task
        
        Args:
            task_id: The ID of the task
            
        Returns:
            bool: Success status
        """
        try:
            response = requests.put(
                f'{self.base_url}/resume-task?task_id={task_id}', 
                headers=self.headers
            )
            response.raise_for_status()
            return True
        except Exception as e:
            logger.error(f"Error resuming Browser Use task: {str(e)}")
            return False
    
    def stop_task(self, task_id: str) -> bool:
        """Stop a running task
        
        Args:
            task_id: The ID of the task
            
        Returns:
            bool: Success status
        """
        try:
            response = requests.put(
                f'{self.base_url}/stop-task?task_id={task_id}', 
                headers=self.headers
            )
            response.raise_for_status()
            return True
        except Exception as e:
            logger.error(f"Error stopping Browser Use task: {str(e)}")
            return False
    
    def get_screenshot(self, task_id: str) -> Optional[str]:
        """Get the latest screenshot from a task
        
        Args:
            task_id: The ID of the task
            
        Returns:
            Optional[str]: Base64 encoded screenshot or None if not available
        """
        try:
            response = requests.get(
                f'{self.base_url}/task/{task_id}/screenshot', 
                headers=self.headers
            )
            response.raise_for_status()
            return response.json().get('screenshot')
        except Exception as e:
            logger.error(f"Error getting screenshot: {str(e)}")
            return None
    
    def list_tasks(self, limit: int = 10, status: str = None) -> List[Dict[str, Any]]:
        """List recent tasks
        
        Args:
            limit: Maximum number of tasks to return
            status: Filter by status (running, finished, failed, stopped)
            
        Returns:
            List[Dict]: List of tasks
        """
        try:
            params = {'limit': limit}
            if status:
                params['status'] = status
                
            response = requests.get(
                f'{self.base_url}/tasks', 
                headers=self.headers,
                params=params
            )
            response.raise_for_status()
            return response.json().get('tasks', [])
        except Exception as e:
            logger.error(f"Error listing tasks: {str(e)}")
            return []
    
    def execute_agent_task(self, submission: Submission) -> EvaluationResult:
        """Execute a task using an agent configuration
        
        Args:
            submission: The submission object containing agent and task details
            
        Returns:
            EvaluationResult: The evaluation result
        """
        try:
            # Get agent configuration
            agent_config = submission.agent.configurationJson
            
            # Get task configuration
            task_config = submission.task.environmentConfig
            
            # Generate instructions based on agent and task configurations
            instructions = self._generate_instructions(agent_config, task_config)
            
            # Set task options
            options = {
                'max_time': task_config.get('maxTimeAllowed', 60),
                'headless': task_config.get('headless', True),
                'record_video': task_config.get('recordVideo', True),
                'tags': [
                    f"submission_{submission.id}",
                    f"agent_{submission.agent.id}",
                    f"task_{submission.task.id}"
                ]
            }
            
            # Create and execute the task
            task_id = self.create_task(instructions, options)
            logger.info(f"Created Browser Use task with ID: {task_id} for submission {submission.id}")
            
            # Wait for task completion
            start_time = time.time()
            task_result = self.wait_for_completion(task_id)
            execution_time = time.time() - start_time
            
            # Process the results
            status = EvaluationStatus.SUCCESS if task_result.get('status') == 'finished' else EvaluationStatus.FAILED
            
            # Calculate metrics based on task output
            metrics = self._calculate_metrics(task_result, task_config)
            
            # Create evaluation result
            evaluation = EvaluationResult(
                submissionId=submission.id,
                score=metrics.get('score', 0),
                timeTaken=execution_time,
                accuracy=metrics.get('accuracy', 0),
                status=status,
                completedAt=time.time(),
                resultDetails={
                    'browser_use_task_id': task_id,
                    'steps': task_result.get('steps', []),
                    'output': task_result.get('output', {}),
                    'metrics': metrics,
                    'video_url': task_result.get('video_url'),
                    'screenshots': task_result.get('screenshots', [])
                }
            )
            
            return evaluation
            
        except Exception as e:
            logger.error(f"Error executing agent task: {str(e)}")
            return EvaluationResult(
                submissionId=submission.id,
                score=0,
                timeTaken=0,
                accuracy=0,
                status=EvaluationStatus.FAILED,
                resultDetails={'error': str(e)}
            )
    
    def _generate_instructions(self, agent_config: Dict[str, Any], task_config: Dict[str, Any]) -> str:
        """Generate instructions for the Browser Use API based on agent and task configurations
        
        Args:
            agent_config: The agent configuration
            task_config: The task configuration
            
        Returns:
            str: The instructions for the Browser Use API
        """
        # Extract task details
        task_url = task_config.get('startUrl', 'https://www.google.com')
        task_objective = task_config.get('objective', 'Search for information')
        
        # Extract agent capabilities
        agent_actions = agent_config.get('actions', [])
        agent_prompts = agent_config.get('prompts', {})
        
        # Build instructions
        instructions = f"Open {task_url} and {task_objective}"
        
        # Add specific actions if defined
        if agent_actions:
            instructions += "\n\nFollow these steps:"
            for idx, action in enumerate(agent_actions):
                action_type = action.get('type')
                action_target = action.get('target')
                action_value = action.get('value')
                
                if action_type and action_target:
                    if action_type == 'click':
                        instructions += f"\n{idx+1}. Click on {action_target}"
                    elif action_type == 'input' and action_value:
                        instructions += f"\n{idx+1}. Enter '{action_value}' into {action_target}"
                    elif action_type == 'select' and action_value:
                        instructions += f"\n{idx+1}. Select '{action_value}' from {action_target}"
                    elif action_type == 'wait':
                        wait_time = action.get('duration', 2)
                        instructions += f"\n{idx+1}. Wait for {wait_time} seconds"
        
        # Add success criteria if defined
        success_criteria = task_config.get('successCriteria', [])
        if success_criteria:
            instructions += "\n\nSuccess criteria:"
            for criterion in success_criteria:
                instructions += f"\n- {criterion}"
        
        return instructions
    
    def _calculate_metrics(self, task_result: Dict[str, Any], task_config: Dict[str, Any]) -> Dict[str, float]:
        """Calculate metrics based on task output and configuration
        
        Args:
            task_result: The task result from Browser Use API
            task_config: The task configuration
            
        Returns:
            Dict: The calculated metrics
        """
        # Default metrics
        metrics = {
            'score': 0,
            'accuracy': 0,
            'completion_rate': 0
        }
        
        # Check if task was completed successfully
        if task_result.get('status') != 'finished':
            return metrics
        
        # Get task output
        output = task_result.get('output', {})
        steps = task_result.get('steps', [])
        
        # Calculate completion rate based on steps
        expected_steps = task_config.get('expectedSteps', 5)
        actual_steps = len(steps)
        completion_rate = min(1.0, actual_steps / max(1, expected_steps))
        
        # Calculate accuracy based on output and expected results
        expected_results = task_config.get('expectedResults', {})
        if expected_results and isinstance(output, dict):
            matches = 0
            for key, expected_value in expected_results.items():
                if key in output and output[key] == expected_value:
                    matches += 1
            
            accuracy = matches / max(1, len(expected_results))
        else:
            # Default accuracy if no expected results are defined
            accuracy = completion_rate
        
        # Calculate overall score
        time_weight = task_config.get('timeWeight', 0.3)
        accuracy_weight = task_config.get('accuracyWeight', 0.7)
        
        # Normalize time factor (lower is better)
        max_time = task_config.get('maxTimeAllowed', 60)
        time_taken = task_result.get('duration', max_time)
        time_factor = max(0, 1 - (time_taken / max_time))
        
        # Calculate weighted score
        score = (time_factor * time_weight + accuracy * accuracy_weight) * 100
        
        return {
            'score': score,
            'accuracy': accuracy,
            'completion_rate': completion_rate,
            'time_factor': time_factor,
            'expected_steps': expected_steps,
            'actual_steps': actual_steps,
            'time_taken': time_taken,
            'max_time': max_time
        }
