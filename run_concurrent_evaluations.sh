
mkdir -p results/logs
mkdir -p data

if [ -f ~/attachments/f8f52be4-0d8c-4c90-979f-75206f5b2232/webvoyager.jsonl ]; then
    cp ~/attachments/f8f52be4-0d8c-4c90-979f-75206f5b2232/webvoyager.jsonl data/
    echo "Copied webvoyager.jsonl to data directory"
fi

if [ -f ~/attachments/6ae7fbd0-c4d6-4c1e-b383-931cdfda9cf4/mind2web_tasks.json ]; then
    cp ~/attachments/6ae7fbd0-c4d6-4c1e-b383-931cdfda9cf4/mind2web_tasks.json data/mind2web.jsonl
    echo "Copied mind2web_tasks.json to data/mind2web.jsonl"
fi

if [ -f ~/attachments/664e2aca-611a-42cd-9b81-c32b1c95891d/webarena.json ]; then
    cp ~/attachments/664e2aca-611a-42cd-9b81-c32b1c95891d/webarena.json data/
    echo "Copied webarena.json to data directory"
fi

pip install -r requirements.txt

export ANTHROPIC_API_KEY="YOUR_ANTHROPIC_API_KEY_1"
export ANTHROPIC_API_KEY_2="YOUR_ANTHROPIC_API_KEY_2"
export BROWSERBASE_API_KEY="YOUR_BROWSERBASE_API_KEY"
export BROWSERBASE_PROJECT_ID="YOUR_BROWSERBASE_PROJECT_ID"

echo "Starting WebVoyager evaluation with all tasks..."
python webvoyager_eval.py --headless --max-retries 2 > results/logs/webvoyager_run.log 2>&1 &
WEBVOYAGER_PID=$!
echo "WebVoyager evaluation started with PID: $WEBVOYAGER_PID"

echo "Starting Mind2Web evaluation with limited tasks..."
python mind2web_eval.py --headless --limit 10 --max-retries 2 > results/logs/mind2web_run.log 2>&1 &
MIND2WEB_PID=$!
echo "Mind2Web evaluation started with PID: $MIND2WEB_PID"

echo "Starting WebArena evaluation with limited tasks..."
python webarena_eval.py --headless --limit 10 --max-retries 2 > results/logs/webarena_run.log 2>&1 &
WEBARENA_PID=$!
echo "WebArena evaluation started with PID: $WEBARENA_PID"

echo "All evaluations started in background. Monitoring logs..."
echo "To view WebVoyager logs: tail -f results/logs/webvoyager_run.log"
echo "To view Mind2Web logs: tail -f results/logs/mind2web_run.log"
echo "To view WebArena logs: tail -f results/logs/webarena_run.log"

echo "Waiting for WebVoyager evaluation to complete..."
wait $WEBVOYAGER_PID
echo "WebVoyager evaluation completed!"

echo "Analyzing results..."
python analyze_results.py

echo "WebVoyager evaluation process complete. Check results directory for outputs."
echo "Mind2Web and WebArena evaluations are still running in the background."
