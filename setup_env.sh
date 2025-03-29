
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "Error: ANTHROPIC_API_KEY environment variable is not set"
    echo "Please set it before running this script:"
    echo "export ANTHROPIC_API_KEY=your_api_key_here"
    exit 1
fi

if [ -n "$ANTHROPIC_API_KEY_2" ]; then
    echo "Using secondary Anthropic API key"
fi

if [ -n "$ANTHROPIC_API_KEY_3" ]; then
    echo "Using tertiary Anthropic API key"
fi

if [ -z "$BROWSERBASE_API_KEY" ]; then
    echo "Warning: BROWSERBASE_API_KEY is not set"
fi

if [ -z "$BROWSERBASE_PROJECT_ID" ]; then
    echo "Warning: BROWSERBASE_PROJECT_ID is not set"
fi

echo "Environment variables checked and ready for evaluation"
