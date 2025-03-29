
if ! command -v parallel &> /dev/null; then
    echo "GNU Parallel is not installed. Installing..."
    sudo apt-get update
    sudo apt-get install -y parallel
fi

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

cat > .env << EOL
BROWSERBASE_API_KEY=your_browserbase_api_key
BROWSERBASE_PROJECT_ID=your_browserbase_project_id
ANTHROPIC_API_KEY=your_anthropic_api_key
EOL
echo "Created .env file with API keys"

if [ -d "venv" ]; then
    source venv/bin/activate
fi

pip install -r requirements.txt

echo "Starting concurrent evaluations with limited tasks for testing..."
parallel --jobs 3 --progress --eta "python {} --headless --limit 5 --max-retries 2" ::: webvoyager_eval.py mind2web_eval.py webarena_eval.py

echo "Starting real-time monitoring dashboard..."
python real_time_monitor.py

echo "All evaluations completed!"
