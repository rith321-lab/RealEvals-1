
mkdir -p results/logs
mkdir -p data

echo "Copying latest dataset files..."
cp ~/attachments/f8f52be4-0d8c-4c90-979f-75206f5b2232/webvoyager.jsonl data/webvoyager.jsonl
echo "Using WebVoyager dataset with 90 tasks"

cp ~/attachments/eb9a1bd5-b7a1-457e-abb9-f0b68bff21ca/mind2web-1.jsonl data/mind2web.jsonl
echo "Using updated Mind2Web dataset with 1009 tasks"

cp ~/attachments/4c879a47-deac-4cb2-ba91-1a520ac29b4b/webarena-1.json data/webarena.json
echo "Using updated WebArena dataset with 812 tasks"


pkill -f "python webvoyager_eval.py" || true
pkill -f "python mind2web_eval.py" || true
pkill -f "python webarena_eval.py" || true

echo "Starting WebVoyager evaluation..."
python webvoyager_eval.py --headless --max-retries 2 > results/logs/webvoyager_run.log 2>&1 &
WEBVOYAGER_PID=$!
echo "WebVoyager evaluation started with PID: $WEBVOYAGER_PID"

echo "Starting Mind2Web evaluation..."
python mind2web_eval.py --headless --max-retries 2 > results/logs/mind2web_run.log 2>&1 &
MIND2WEB_PID=$!
echo "Mind2Web evaluation started with PID: $MIND2WEB_PID"

echo "Starting WebArena evaluation..."
python webarena_eval.py --headless --max-retries 2 > results/logs/webarena_run.log 2>&1 &
WEBARENA_PID=$!
echo "WebArena evaluation started with PID: $WEBARENA_PID"

echo "All evaluations started. You can monitor the logs with:"
echo "tail -f results/logs/webvoyager_run.log"
echo "tail -f results/logs/mind2web_run.log"
echo "tail -f results/logs/webarena_run.log"

echo "WebVoyager PID: $WEBVOYAGER_PID" > results/evaluations_running.txt
echo "Mind2Web PID: $MIND2WEB_PID" >> results/evaluations_running.txt
echo "WebArena PID: $WEBARENA_PID" >> results/evaluations_running.txt
echo "Started at: $(date)" >> results/evaluations_running.txt

echo "All evaluations are now running with the updated datasets:"
echo "- WebVoyager: 90 tasks"
echo "- Mind2Web: 1009 tasks"
echo "- WebArena: 812 tasks"
