#!/bin/bash
set -e

cd frontend
bun lint
bun run build
cd ..

bun lint
bun run build

mkdir -p dist/data
cp src/data/* dist/data/

npx concurrently "bun dev" "cd frontend && bun dev"