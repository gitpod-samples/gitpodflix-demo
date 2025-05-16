# GitpodFlix Migration to Python/Django

This document outlines the migration of the GitpodFlix application from Node.js/Express to Python/Django.

## Migration Overview

The GitpodFlix application has been migrated from:
- Node.js/Express backend to Django/Django REST Framework
- Keeping the React frontend with minor updates to work with the new API

## Key Changes

### Backend
- Replaced Express API with Django REST Framework
- Migrated database models to Django ORM
- Implemented equivalent API endpoints:
  - `GET /api/movies/`: Get all movies
  - `POST /api/movies/seed/`: Seed the database with sample data
  - `POST /api/movies/clear/`: Clear all data from the database

### Frontend
- Updated API service to work with Django REST Framework endpoints
- Maintained the same UI and functionality

## Running the Migrated Application

### Django Backend
```bash
cd django_backend
python3 manage.py migrate
python3 manage.py runserver 0.0.0.0:3001
```

### React Frontend
```bash
cd react_frontend
npm install
npm run dev
```

## Database
The application continues to use PostgreSQL, but now managed through Django's ORM system.

## Future Improvements
- Add Django admin interface customization
- Implement user authentication with Django's auth system
- Add more comprehensive test coverage
