#!/bin/bash
set -e

mongoimport --host mongodb --authenticationDatabase admin --username ${MONGO_INITDB_ROOT_USERNAME} --password ${MONGO_INITDB_ROOT_PASSWORD} --db ${MONGO_INITDB_DATABASE} --collection video_games --type csv --headerline --file /init.csv

exec "$@"
