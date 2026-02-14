#!/bin/bash

# Path to Chrome executable
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Remote debugging port
DEBUG_PORT=9222

# URL to open
START_URL="http://localhost:6001/"

# User data directory for debug mode
USER_DATA_DIR="/tmp/chrome-debug-profile"

# Close any running Chrome instances first
killall "Google Chrome" 2>/dev/null

# Create user data directory if it doesn't exist
mkdir -p "$USER_DATA_DIR"

# Start Chrome with remote debugging enabled and open the URL
"$CHROME_PATH" \
  --remote-debugging-port=$DEBUG_PORT \
  --user-data-dir="$USER_DATA_DIR" \
  "$START_URL" &

echo "Chrome started with remote debugging on port $DEBUG_PORT"
echo "Navigate to chrome://inspect to view the debug connection"
