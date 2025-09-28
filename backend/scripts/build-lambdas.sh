#!/bin/bash

# Build script for all Lambda functions (Go)
# This script loops over all lambdas in src/go/lambdas and builds them
# The built binary will be placed in backend/dist/go-lambdas

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

LAMBDAS_DIR="$PROJECT_ROOT/src/go/lambdas"
DIST_DIR="$PROJECT_ROOT/dist/go-lambdas"
mkdir -p "$DIST_DIR"

if [ ! -d "$LAMBDAS_DIR" ]; then
    echo "Error: Lambdas directory not found: $LAMBDAS_DIR"
    exit 1
fi

echo "Building Lambda functions..."
lambda_dirs=$(find "$LAMBDAS_DIR" -type d -name "run" | sed 's|/cmd/run$||')

if [ -z "$lambda_dirs" ]; then
    echo "No Lambda functions found (no cmd/run directories in $LAMBDAS_DIR)"
    exit 0
fi


for dir in $lambda_dirs; do
    lambda_name=$(basename "${dir}")
    out_dir="$DIST_DIR/$lambda_name"
    out_path="$out_dir/bootstrap"
    echo "Building Lambda '${lambda_name}' in $dir..."
    mkdir -p "$out_dir"
    # Build a statically linked binary to avoid glibc version dependency issues in Lambda.
    # CGO is disabled to ensure no dynamic glibc linkage; ldflags reduce size.
    (cd "$dir/cmd/run" && \
        CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
        go build -ldflags "-s -w" -o "$out_path" .)
    chmod +x "$out_path"
    echo "Built: $out_path"
done

echo "✅ All Lambda functions built!"
