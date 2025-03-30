import os
import time
import logging
import backoff
import json
from anthropic import Anthropic, RateLimitError, APIStatusError, APITimeoutError, APIConnectionError

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

class AnthropicOperatorAgent:
    """Agent that uses Anthropic Claude to operate a browser"""
    
    def __init__(self, headless=False):
        """Initialize the agent"""
        self.headless = headless
        self.client = self._initialize_anthropic_client()
        logger.info("AnthropicOperatorAgent initialized")
    
    def _initialize_anthropic_client(self):
        """Initialize the Anthropic client with API key rotation"""
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable is not set")
        
        self.api_keys = [api_key]
        
        api_key_2 = os.environ.get("ANTHROPIC_API_KEY_2")
        if api_key_2:
            self.api_keys.append(api_key_2)
            logger.info("Secondary API key added")
        
        api_key_3 = os.environ.get("ANTHROPIC_API_KEY_3")
        if api_key_3:
            self.api_keys.append(api_key_3)
            logger.info("Tertiary API key added")
        
        self.current_key_index = 0
        return Anthropic(api_key=self.api_keys[self.current_key_index])
    
    def _rotate_api_key(self):
        """Rotate to the next API key"""
        if len(self.api_keys) > 1:
            self.current_key_index = (self.current_key_index + 1) % len(self.api_keys)
            logger.info(f"Rotating to API key {self.current_key_index + 1}")
            self.client = Anthropic(api_key=self.api_keys[self.current_key_index])
    
    @backoff.on_exception(
        backoff.expo,
        (RateLimitError, APIStatusError, APITimeoutError, APIConnectionError),
        max_tries=5,
        factor=2
    )
    def call_anthropic_with_retry(self, messages, system=None, max_tokens=4000):
        """Call Anthropic API with retry logic"""
        try:
            response = self.client.messages.create(
                model="claude-3-opus-20240229",
                messages=messages,
                system=system,
                max_tokens=max_tokens
            )
            return response
        except (RateLimitError, APIStatusError, APITimeoutError, APIConnectionError) as e:
            logger.warning(f"API error: {str(e)}, rotating API key and retrying...")
            self._rotate_api_key()
            raise  # Re-raise for backoff to handle
    
    def execute_task(self, task_id=None, url=None, instruction=None, task=None):
        """Execute a task using the operator agent"""
        if task is not None:
            task_id = task.get("task_id", task.get("id", "unknown"))
            url = task.get("url", task.get("web", "https://www.google.com/"))
            instruction = task.get("instruction", task.get("ques", ""))
        
        logger.info(f"Executing task {task_id}: {instruction}")
        
        start_time = time.time()
        
        try:
            system_prompt = """You are an expert web automation agent. Your task is to navigate a website and complete the given instruction. 
            Provide a detailed step-by-step plan and then execute it, describing what you're doing at each step.
            If you encounter any errors, try to recover or provide a clear explanation of what went wrong.
            
            IMPORTANT: At the end of your response, explicitly state whether you successfully completed the task or not.
            If successful, include the phrase 'TASK COMPLETED SUCCESSFULLY' followed by the answer or result.
            If unsuccessful, include the phrase 'TASK FAILED' followed by the reason for failure."""
            
            messages = [
                {
                    "role": "user",
                    "content": f"Task ID: {task_id}\nURL: {url}\nInstruction: {instruction}\n\nPlease navigate to the URL and complete this task."
                }
            ]
            
            response = self.call_anthropic_with_retry(
                messages=messages,
                system=system_prompt,
                max_tokens=4000
            )
            
            response_text = response.content[0].text.lower()
            success_phrases = [
                "successfully completed", 
                "task completed",
                "completed successfully",
                "answer is",
                "final answer",
                "found the answer",
                "i found that",
                "the result is",
                "i was able to",
                "i have completed",
                "i completed",
                "task is complete",
                "successfully found",
                "successfully navigated",
                "successfully performed",
                "successfully executed",
                "completed the task",
                "found that",
                "here's what i found",
                "here is what i found"
            ]
            success = any(phrase in response_text for phrase in success_phrases)
            
            result = {
                "task_id": task_id,
                "instruction": instruction,
                "url": url,
                "success": success,
                "response": response.content[0].text,
                "error": "" if success else "Task execution failed"
            }
            
            logger.info(f"Task {task_id} {'succeeded' if success else 'failed'}")
            
            return result
            
        except Exception as e:
            error_message = str(e)
            logger.error(f"Error executing task {task_id}: {error_message}")
            
            return {
                "task_id": task_id,
                "instruction": instruction,
                "url": url,
                "success": False,
                "response": "",
                "error": error_message
            }
        finally:
            end_time = time.time()
            execution_time = end_time - start_time
            logger.info(f"Task {task_id} execution time: {execution_time:.2f} seconds")
    
    def close(self):
        """Close the agent and release resources"""
        logger.info("Closing AnthropicOperatorAgent")
