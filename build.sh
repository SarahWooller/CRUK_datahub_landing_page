#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

rm -rf docs

# 1. Build the frontend
npm run build

# 2. Run the python script using the pipenv environment
# 'pipenv run' executes the command within the virtualenv without nesting shells
pipenv run python python_helper_code_and_jsons/move_files.py

# 3. Change directory and start the server
cd docs
npx http-server