#!/bin/bash

# Run migrations
python3 manage.py makemigrations
python3 manage.py migrate

# Start server
python3 manage.py runserver 0.0.0.0:3001
