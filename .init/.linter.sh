#!/bin/bash
cd /home/kavia/workspace/code-generation/bountyhub-2004-2015/bounty_board_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

