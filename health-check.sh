#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🔍 GitpodFlix Health Check"
echo "=========================="

# Check PostgreSQL
print_status "Checking PostgreSQL database..."
if PGPASSWORD=gitpod psql -h localhost -U gitpod -d gitpodflix -c "SELECT 1" >/dev/null 2>&1; then
    MOVIE_COUNT=$(PGPASSWORD=gitpod psql -h localhost -U gitpod -d gitpodflix -t -c "SELECT COUNT(*) FROM movies" 2>/dev/null | xargs)
    if [ "$MOVIE_COUNT" -gt 0 ]; then
        print_success "PostgreSQL: ✅ Connected ($MOVIE_COUNT movies in database)"
    else
        print_warning "PostgreSQL: ⚠️  Connected but no movies in database"
    fi
else
    print_error "PostgreSQL: ❌ Connection failed"
    POSTGRES_FAILED=1
fi

# Check Backend API
print_status "Checking Backend API..."
if curl -s http://localhost:3001/health >/dev/null 2>&1; then
    API_RESPONSE=$(curl -s http://localhost:3001/health | jq -r '.status' 2>/dev/null)
    if [ "$API_RESPONSE" = "OK" ]; then
        print_success "Backend API: ✅ http://localhost:3001 (Status: $API_RESPONSE)"
    else
        print_warning "Backend API: ⚠️  Responding but status unclear"
    fi
else
    print_error "Backend API: ❌ Not responding on http://localhost:3001"
    BACKEND_FAILED=1
fi

# Check Frontend
print_status "Checking Frontend..."
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    TITLE=$(curl -s http://localhost:3000 | grep -o '<title>.*</title>' | sed 's/<[^>]*>//g')
    if [ ! -z "$TITLE" ]; then
        print_success "Frontend: ✅ http://localhost:3000 ($TITLE)"
    else
        print_warning "Frontend: ⚠️  Responding but title not found"
    fi
else
    print_error "Frontend: ❌ Not responding on http://localhost:3000"
    FRONTEND_FAILED=1
fi

# Check API endpoints
print_status "Checking API endpoints..."
if curl -s http://localhost:3001/api/movies >/dev/null 2>&1; then
    MOVIES_COUNT=$(curl -s http://localhost:3001/api/movies | jq length 2>/dev/null)
    if [ "$MOVIES_COUNT" -gt 0 ]; then
        print_success "Movies API: ✅ /api/movies ($MOVIES_COUNT movies)"
    else
        print_warning "Movies API: ⚠️  Endpoint responding but no movies returned"
    fi
else
    print_error "Movies API: ❌ /api/movies not responding"
fi

# Check search functionality
if curl -s "http://localhost:3001/api/search?q=dark" >/dev/null 2>&1; then
    SEARCH_RESULTS=$(curl -s "http://localhost:3001/api/search?q=dark" | jq '.results | length' 2>/dev/null)
    if [ "$SEARCH_RESULTS" -gt 0 ]; then
        print_success "Search API: ✅ /api/search ($SEARCH_RESULTS results for 'dark')"
    else
        print_warning "Search API: ⚠️  Endpoint responding but no search results"
    fi
else
    print_error "Search API: ❌ /api/search not responding"
fi

# Summary
echo ""
echo "📊 Health Check Summary"
echo "======================"

if [ -z "$POSTGRES_FAILED" ] && [ -z "$BACKEND_FAILED" ] && [ -z "$FRONTEND_FAILED" ]; then
    print_success "All services are healthy! 🎉"
    echo ""
    echo "🌐 Access URLs:"
    echo "   Frontend:    http://localhost:3000"
    echo "   Backend API: http://localhost:3001"
    echo "   Health:      http://localhost:3001/health"
    echo ""
    exit 0
else
    print_error "Some services have issues. Check the logs above."
    echo ""
    echo "🔧 Troubleshooting:"
    if [ ! -z "$POSTGRES_FAILED" ]; then
        echo "   PostgreSQL: docker logs main-postgres-1"
    fi
    if [ ! -z "$BACKEND_FAILED" ]; then
        echo "   Backend:    tail -f /tmp/catalog.log"
    fi
    if [ ! -z "$FRONTEND_FAILED" ]; then
        echo "   Frontend:   tail -f /tmp/frontend.log"
    fi
    echo ""
    exit 1
fi
