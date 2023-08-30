#!/usr/bin/env sh

export NEXT_TELEMETRY_DISABLED=1

# Explanation for the 'cp' command:
# https://nextjs.org/docs/pages/api-reference/next-config-js/output#automatically-copying-traced-files
npx next build && cp -r .next/static .next/standalone/.next/static
