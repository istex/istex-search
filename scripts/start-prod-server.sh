#!/usr/bin/env sh

# Build for production if needed
if [ ! -d ".next" ]; then
  echo "Building for production..."
  npm run build
else
  echo "Using existing production build..."
fi

NEXT_TELEMETRY_DISABLED=1

# The next start command is not supported in standalone mode so we have
# to copy the static files and start the server script with node manually
cp -r .next/static .next/standalone/.next/static && node .next/standalone/server.js
