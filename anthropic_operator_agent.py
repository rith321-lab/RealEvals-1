import os
import json
import time
import logging
import backoff
import anthropic
from playwright.sync_api import sync_playwright
from urllib.parse import urlparse

class AnthropicOperatorAgent:
    def __init__(self, headless=False):
        """Initialize the AnthropicOperatorAgent"""
        self.api_keys = []
        
        if os.environ.get("ANTHROPIC_API_KEY"):
            self.api_keys.append(os.environ.get("ANTHROPIC_API_KEY"))
        
        if os.environ.get("ANTHROPIC_API_KEY_2"):
            self.api_keys.append(os.environ.get("ANTHROPIC_API_KEY_2"))
        
        if not self.api_keys:
            logging.warning("No Anthropic API keys found in environment variables")
            self.api_keys = ["YOUR_API_KEY_HERE"]  # Will be replaced by user
        
        self.current_key_index = 0
        self.client = self._create_client()
        
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.launch(
            headless=headless,
            chromium_sandbox=True,
            env={},
            args=[
                "--disable-extensions",
                "--disable-file-system"
            ]
        )
        self.context = self.browser.new_context()
        self.page = self.context.new_page()
    
    def _create_client(self):
        """Create an Anthropic client with the current API key"""
        if not self.api_keys:
            raise ValueError("No API keys available")
        
        api_key = self.api_keys[self.current_key_index]
        logging.info(f"Using API key index: {self.current_key_index}")
        
        return anthropic.Anthropic(api_key=api_key)
    
    def rotate_api_key(self):
        """Rotate to the next available API key"""
        if len(self.api_keys) <= 1:
            logging.warning("Only one API key available, cannot rotate")
            return False
        
        self.current_key_index = (self.current_key_index + 1) % len(self.api_keys)
        logging.info(f"Rotated to API key index: {self.current_key_index}")
        
        self.client = self._create_client()
        return True
    
    def _validate_url(self, url):
        """Validate and normalize a URL"""
        if not url:
            return None
        
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        
        try:
            result = urlparse(url)
            if not result.netloc:
                return None
            return url
        except Exception as e:
            logging.error(f"Invalid URL: {url} - {str(e)}")
            return None
    
    @backoff.on_exception(
        backoff.expo,
        (anthropic.RateLimitError, anthropic.APIError),
        max_tries=5,
        factor=2
    )
    def _call_claude_with_retry(self, system_prompt, user_prompt):
        """Call Claude API with retry logic for rate limits"""
        try:
            response = self.client.messages.create(
                model="claude-3-opus-20240229",
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
                max_tokens=4000
            )
            return response.content[0].text
        except anthropic.RateLimitError as e:
            logging.warning(f"Rate limit exceeded: {str(e)}")
            
            if self.rotate_api_key():
                logging.info("Rotated API key due to rate limit")
            
            raise
        except Exception as e:
            logging.error(f"API call failed: {str(e)}")
            raise
    
    def execute_task(self, task):
        """Execute a web task using Claude and Playwright"""
        task_id = task.get("task_id", "unknown")
        instruction = task.get("instruction", "")
        url = task.get("url", "")
        
        logging.info(f"Starting task: {task_id}")
        
        start_time = time.time()
        success = False
        answer = ""
        error = ""
        
        try:
            valid_url = self._validate_url(url)
            if not valid_url:
                logging.warning(f"Invalid navigation URL: {url}")
                error = f"Invalid URL: {url}"
                return {
                    "task_id": task_id,
                    "success": False,
                    "answer": "",
                    "expected_answer": task.get("expected_answer", ""),
                    "time_taken": time.time() - start_time,
                    "error": error
                }
            
            try:
                self.page.goto(valid_url, wait_until="domcontentloaded", timeout=30000)
                logging.info(f"Navigated to {valid_url}")
            except Exception as e:
                logging.error(f"Navigation failed: {str(e)}")
                error = f"Navigation error: {str(e)}"
                return {
                    "task_id": task_id,
                    "success": False,
                    "answer": "",
                    "expected_answer": task.get("expected_answer", ""),
                    "time_taken": time.time() - start_time,
                    "error": error
                }
            
            page_content = self.page.content()
            
            system_prompt = """
            You are a web automation agent. Your task is to help users navigate websites and perform actions.
            You will be given a task to perform on a website, along with the current HTML of the page.
            Respond with a JSON object containing the following fields:
            1. "thoughts": Your reasoning about how to approach the task
            2. "action": The action to take (click, type, navigate, extract)
            3. "selector": The CSS selector or XPath to target (for click, type actions)
            4. "value": The value to type (for type action) or URL (for navigate action)
            5. "answer": Your final answer to the task, if you've completed it
            
            Example response:
            {
                "thoughts": "I need to search for something on this page",
                "action": "type",
                "selector": "input[name='q']",
                "value": "search query",
                "answer": ""
            }
            """
            
            user_prompt = f"""
            Task: {instruction}
            
            Current URL: {self.page.url}
            
            Current page HTML:
            ```html
            {page_content[:50000]}  # Truncate to avoid token limits
            ```
            
            Please analyze the page and determine the next action to take to complete the task.
            """
            
            response_text = self._call_claude_with_retry(system_prompt, user_prompt)
            
            try:
                response_json = json.loads(response_text)
                
                action = response_json.get("action", "")
                selector = response_json.get("selector", "")
                value = response_json.get("value", "")
                
                if action == "click":
                    try:
                        self.page.click(selector, timeout=5000)
                    except Exception as e:
                        logging.error(f"Action step failed: {str(e)}")
                
                elif action == "type":
                    try:
                        self.page.fill(selector, value, timeout=5000)
                    except Exception as e:
                        logging.error(f"Action step failed: {str(e)}")
                
                elif action == "navigate":
                    valid_nav_url = self._validate_url(value)
                    if valid_nav_url:
                        try:
                            self.page.goto(valid_nav_url, wait_until="domcontentloaded", timeout=30000)
                        except Exception as e:
                            logging.error(f"Navigation failed: {str(e)}")
                
                answer = response_json.get("answer", "")
                if answer:
                    success = True
                
            except json.JSONDecodeError as e:
                logging.error(f"Failed to parse response: {str(e)}")
                error = f"Response parsing error: {str(e)}"
        
        except Exception as e:
            logging.error(f"Task execution failed: {str(e)}")
            error = f"Execution error: {str(e)}"
        
        time_taken = time.time() - start_time
        logging.info(f"Task completed in {time_taken:.2f} seconds")
        
        return {
            "task_id": task_id,
            "success": success,
            "answer": answer,
            "expected_answer": task.get("expected_answer", ""),
            "time_taken": time_taken,
            "error": error
        }
    
    def close(self):
        """Close browser and Playwright"""
        if self.browser:
            self.browser.close()
        if self.playwright:
            self.playwright.stop()
