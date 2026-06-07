#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"
echo "VERCEL_ENV: $VERCEL_ENV"

if [[ "$VERCEL_GIT_COMMIT_REF" == "prod" || "$VERCEL_GIT_COMMIT_REF" == "preview" ]]; then
  echo "build can proceed"
  exit 1;
else
  echo "build cancelled"
  exit 0;
fi