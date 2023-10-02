#!/bin/sh

export NEXT_TELEMETRY_DISABLED=1

# The 'next start' command is not supported in standalone mode
# so we have to start the server script with node manually
node .next/standalone/server.js
