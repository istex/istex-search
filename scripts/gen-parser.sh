#!/bin/bash

ROOT_DIR=$(dirname "$(dirname "$(realpath "${BASH_SOURCE[0]}")")")
PARSER_DIR="$ROOT_DIR/src/lib/queryParser"
GRAMMAR_FILE="$PARSER_DIR/lucene.grammar"
OUTPUT_FILE="$PARSER_DIR/parser.js"

# Generate parser
npx peggy \
  --cache \
  --format es \
  -o $OUTPUT_FILE \
  $GRAMMAR_FILE

# Disable eslint on the output file
sed -i "1s;^;/* eslint-disable */\n\n;" $OUTPUT_FILE

# Run prettier on the output file
npx prettier --write $OUTPUT_FILE
