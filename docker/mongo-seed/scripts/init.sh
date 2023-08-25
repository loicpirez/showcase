#!/bin/bash
set -e

# Check if the collection is empty
COUNT=$(mongosh --host mongodb --authenticationDatabase admin --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD --eval "db.getSiblingDB('showcase').video_games.countDocuments()" | tail -n 1)

if [ $COUNT -eq 0 ]; then
  echo "Seeding the database..."
  mongoimport --host mongodb --authenticationDatabase admin --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD --db $MONGO_INITDB_DATABASE --collection video_games --type csv --headerline --file /app/dataset.csv --upsert
  echo "Seeding Elasticsearch..."
  echo "Installing dependencies..."
  npm install -g mongodb @elastic/elasticsearch
  npm link mongodb @elastic/elasticsearch
  ./wait-for-it.sh -t 120 elasticsearch:9200 -- node /app/seed-elasticsearch.js
else
  echo "Database already seeded, nothing to do"
fi

exec "$@"
