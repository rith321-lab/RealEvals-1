import os
import json
import time
import logging
import urllib.parse
from datetime import datetime
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright, Error as PlaywrightError
import anthropic
import backoff

load_dotenv()

class AnthropicOperatorAgent:
    def __init__(self, headless=False):
        self.client = anthropic.Anthropic(
            api_key=os.environ.get("ANTHROPIC_API_KEY")
        )
        
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
        
        self.logger = logging.getLogger("operator_agent")
    
    def _is_valid_url(self, url):
        """Check if a URL is valid"""
        try:
            result = urllib.parse.urlparse(url)
            return all([result.scheme, result.netloc])
        except:
            return False
    
    @backoff.on_exception(
        backoff.expo,
        (anthropic.RateLimitError, anthropic.APITimeoutError, anthropic.APIConnectionError),
        max_tries=3,
        max_time=60
    )
    def _call_claude_with_retry(self, prompt):
        """Call Claude API with retry logic"""
        return self.client.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=4000,
            temperature=0.2,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
    
    def execute_task(self, task):
        """Execute a web task using the Anthropic Claude model"""
        start_time = time.time()
        task_id = task.get("task_id", "unknown")
        self.logger.info(f"Starting task: {task_id}")
        
        try:
            if 'web' in task and task['web']:
                url = task['web']
                if not self._is_valid_url(url):
                    self.logger.warning(f"Invalid URL: {url}. Using default Google URL.")
                    url = "https://www.google.com/"
                
                try:
                    self.page.goto(url, timeout=30000)
                    self.logger.info(f"Navigated to {url}")
                except PlaywrightError as e:
                    self.logger.error(f"Navigation error: {str(e)}")
                    try:
                        self.page.goto("https://www.google.com/", timeout=30000)
                        self.logger.info("Navigated to fallback URL (Google)")
                    except PlaywrightError as e2:
                        self.logger.error(f"Fallback navigation also failed: {str(e2)}")
                        return {
                            "task_id": task_id,
                            "success": False,
                            "answer": "",
                            "expected_answer": task.get("Final answer", ""),
                            "time_taken": time.time() - start_time,
                            "error": f"Navigation failed: {str(e)}"
                        }
            elif 'website' in task:
                website = task['website']
                url = f"https://www.{website}.com/"
                if not self._is_valid_url(url):
                    self.logger.warning(f"Invalid constructed URL: {url}. Using default Google URL.")
                    url = "https://www.google.com/"
                
                try:
                    self.page.goto(url, timeout=30000)
                    self.logger.info(f"Navigated to {url}")
                except PlaywrightError as e:
                    self.logger.error(f"Navigation error: {str(e)}")
                    try:
                        self.page.goto("https://www.google.com/", timeout=30000)
                        self.logger.info("Navigated to fallback URL (Google)")
                    except PlaywrightError as e2:
                        self.logger.error(f"Fallback navigation also failed: {str(e2)}")
                        return {
                            "task_id": task_id,
                            "success": False,
                            "answer": "",
                            "expected_answer": task.get("Final answer", ""),
                            "time_taken": time.time() - start_time,
                            "error": f"Navigation failed: {str(e)}"
                        }
            else:
                try:
                    self.page.goto("https://www.google.com/", timeout=30000)
                    self.logger.info("No URL provided. Navigated to default URL (Google)")
                except PlaywrightError as e:
                    self.logger.error(f"Default navigation failed: {str(e)}")
                    return {
                        "task_id": task_id,
                        "success": False,
                        "answer": "",
                        "expected_answer": task.get("Final answer", ""),
                        "time_taken": time.time() - start_time,
                        "error": f"Default navigation failed: {str(e)}"
                    }
            
            try:
                page_content = self.page.content()
                screenshot = self.page.screenshot(type="jpeg", quality=50)
            except PlaywrightError as e:
                self.logger.error(f"Failed to get page content: {str(e)}")
                page_content = "<html><body>Error: Could not retrieve page content</body></html>"
            
            prompt = self._create_prompt(task, page_content)
            
            try:
                response = self._call_claude_with_retry(prompt)
                action = self._parse_action(response.content[0].text)
                result = self._execute_action(action)
            except Exception as e:
                self.logger.error(f"API or action execution error: {str(e)}")
                return {
                    "task_id": task_id,
                    "success": False,
                    "answer": "",
                    "expected_answer": task.get("Final answer", ""),
                    "time_taken": time.time() - start_time,
                    "error": f"API or action execution error: {str(e)}"
                }
            
            execution_time = time.time() - start_time
            self.logger.info(f"Task completed in {execution_time:.2f} seconds")
            
            return {
                "task_id": task_id,
                "success": result["success"],
                "answer": result["answer"],
                "expected_answer": task.get("Final answer", ""),
                "time_taken": execution_time,
                "error": result.get("error", "")
            }
            
        except Exception as e:
            execution_time = time.time() - start_time
            self.logger.error(f"Task failed: {str(e)}")
            
            return {
                "task_id": task_id,
                "success": False,
                "answer": "",
                "expected_answer": task.get("Final answer", ""),
                "time_taken": execution_time,
                "error": str(e)
            }
    
    def _create_prompt(self, task, page_content):
        """Create a prompt for Claude based on the task and current page state"""
        if 'ques' in task:
            instruction = task['ques']
        elif 'instruction' in task:
            instruction = task['instruction']
        else:
            instruction = "Complete the task on this webpage"
        
        max_content_length = 30000
        truncated_content = page_content[:max_content_length]
        if len(page_content) > max_content_length:
            truncated_content += "\n... [content truncated] ..."
        
        prompt = f"""
        You are a web automation agent. Your task is to help me navigate and interact with a webpage to accomplish a specific goal.
        
        TASK: {instruction}
        
        CURRENT WEBPAGE HTML:
        ```html
        {truncated_content}
        ```
        
        Please provide step-by-step instructions on how to accomplish this task. For each step, specify:
        1. The action to take (click, type, navigate, etc.)
        2. The element to interact with (provide selector or description)
        3. Any input values if needed
        
        Format your response as JSON with the following structure:
        {{
            "actions": [
                {{
                    "type": "click/type/navigate/etc",
                    "selector": "CSS selector or description",
                    "value": "Input value if applicable"
                }}
            ],
            "answer": "Final answer or result of the task"
        }}
        """
        
        return prompt
    
    def _parse_action(self, response_text):
        """Parse the action from Claude's response"""
        try:
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            
            if json_start == -1 or json_end == 0:
                self.logger.warning("Failed to find JSON in response, using default action")
                return {
                    "actions": [],
                    "answer": "Failed to parse response"
                }
            
            json_str = response_text[json_start:json_end]
            return json.loads(json_str)
        except Exception as e:
            self.logger.error(f"Failed to parse action: {str(e)}")
            try:
                answer_start = response_text.lower().find("answer:")
                if answer_start != -1:
                    answer = response_text[answer_start + 7:].strip()
                    answer = answer.split("\n")[0].strip()
                    self.logger.info(f"Extracted answer from text: {answer}")
                    return {
                        "actions": [],
                        "answer": answer
                    }
            except:
                pass
                
            return {
                "actions": [],
                "answer": "Failed to parse response"
            }
    
    def _execute_action(self, action):
        """Execute the action on the webpage"""
        try:
            for step in action.get("actions", []):
                action_type = step.get("type", "").lower()
                selector = step.get("selector", "")
                value = step.get("value", "")
                
                try:
                    if action_type == "click":
                        self.page.click(selector, timeout=5000)
                        self.logger.info(f"Clicked on {selector}")
                    
                    elif action_type == "type":
                        self.page.fill(selector, value, timeout=5000)
                        self.logger.info(f"Typed '{value}' into {selector}")
                    
                    elif action_type == "navigate":
                        if self._is_valid_url(value):
                            self.page.goto(value, timeout=30000)
                            self.logger.info(f"Navigated to {value}")
                        else:
                            self.logger.warning(f"Invalid navigation URL: {value}")
                    
                    try:
                        self.page.wait_for_load_state("networkidle", timeout=5000)
                    except PlaywrightError:
                        self.logger.warning("Timeout waiting for network idle")
                    
                    time.sleep(1)  # Additional safety delay
                    
                except PlaywrightError as e:
                    self.logger.error(f"Action step failed: {str(e)}")
            
            return {
                "success": True,
                "answer": action.get("answer", "")
            }
        
        except Exception as e:
            self.logger.error(f"Action execution failed: {str(e)}")
            return {
                "success": False,
                "answer": "",
                "error": str(e)
            }
    
    def close(self):
        """Close the browser and playwright"""
        try:
            self.context.close()
            self.browser.close()
            self.playwright.stop()
        except Exception as e:
            self.logger.error(f"Error closing browser: {str(e)}")
