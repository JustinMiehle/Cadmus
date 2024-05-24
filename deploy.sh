#!/bin/bash
set -e

gcloud config set project electionprograms
cd frontend
bun run build
cd ..
bun run build
    
npm install

mkdir -p ./dist/data
cp -r ./src/data/ ./dist/data/

gcloud app deploy -q