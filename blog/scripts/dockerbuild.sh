#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Navigate to the parent directory (blog root)
cd "$SCRIPT_DIR/.."

# Get version from package.json using the absolute path
VERSION=$(node -p "require('./package.json').version")

# Check if version was successfully extracted
if [ -z "$VERSION" ]; then
    echo "Error: Failed to extract version from package.json"
    exit 1
fi

echo "Building Docker image with version: $VERSION"

# Build docker image with correct paths
docker build -t andreasroither/blog:$VERSION -t andreasroither/blog:latest -f ./dockerfile .