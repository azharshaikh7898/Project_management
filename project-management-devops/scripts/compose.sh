#!/usr/bin/env bash

# Standalone Docker Compose wrapper for local development
# Usage: ./scripts/compose.sh [up|down|logs|ps]

set -euo pipefail

COMPOSE_FILE="docker/docker-compose.yml"
PROJECT_NAME="project-management"

case "${1:-up}" in
  up)
    echo "Starting local development environment..."
    docker run --rm -v "$(pwd):$(pwd)" -w "$(pwd)" --network host \
      ghcr.io/docker/compose:latest -f "$COMPOSE_FILE" -p "$PROJECT_NAME" up -d
    echo "✓ Services started"
    echo "  Frontend:  http://localhost:80"
    echo "  Backend:   http://localhost:3000"
    echo "  Health:    http://localhost:3000/health"
    echo "  Database:  localhost:5432"
    ;;
  down)
    echo "Stopping services..."
    docker run --rm -v "$(pwd):$(pwd)" -w "$(pwd)" --network host \
      ghcr.io/docker/compose:latest -f "$COMPOSE_FILE" -p "$PROJECT_NAME" down -v
    echo "✓ Services stopped"
    ;;
  logs)
    docker run --rm -v "$(pwd):$(pwd)" -w "$(pwd)" --network host \
      ghcr.io/docker/compose:latest -f "$COMPOSE_FILE" -p "$PROJECT_NAME" logs -f
    ;;
  ps)
    docker run --rm -v "$(pwd):$(pwd)" -w "$(pwd)" --network host \
      ghcr.io/docker/compose:latest -f "$COMPOSE_FILE" -p "$PROJECT_NAME" ps
    ;;
  *)
    echo "Usage: $0 {up|down|logs|ps}"
    exit 1
    ;;
esac
