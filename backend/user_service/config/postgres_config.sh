#!/bin/sh
psql -U $POSTGRES_USER -d $POSTGRES_DB -a -f ./table_config.sql