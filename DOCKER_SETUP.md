# Docker Setup Guide

This guide provides instructions for dockerizing your Next.js application for local development and production deployment.

## Overview

The project includes:

- **Dockerfile**: Production-ready Docker configuration with multi-stage build
- **Dockerfile.dev**: Development-specific Docker configuration with hot reload
- **docker-compose-dev.yaml**: Development environment orchestration
- **docker-compose-prod.yaml**: Production environment orchestration
- **.dockerignore**: Optimized build context to exclude unnecessary files

## Development Setup

### Prerequisites

- Docker installed (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

### Quick Start

1. **Start the development container:**

```bash
docker compose -f docker-compose-dev.yaml up -d
```

This will:

- Build the Docker image using [`Dockerfile.dev`](Dockerfile.dev:1)
- Start the application on port 3000
- Enable hot reload by mounting the source code

2. **Access the application:**

Open your browser and navigate to: `http://localhost:3000`

3. **View logs:**

```bash
docker compose -f docker-compose-dev.yaml logs -f app
```

4. **Stop the development container:**

```bash
docker compose -f docker-compose-dev.yaml down
```

### Development Features

The development setup includes:

- Hot reload for automatic code updates
- Source code mounted as a volume
- Full access to Node.js environment
- Non-root user execution for security

## Production Deployment

### Building the Production Image

1. **Build the Docker image:**

```bash
docker build -t publishers-landing:latest .
```

2. **Run the production container:**

```bash
docker run -p 3000:3000 --name publishers-landing publishers-landing:latest
```

### Using Docker Compose for Production

1. **Add environment variables** in [`docker-compose-prod.yaml`](docker-compose-prod.yaml:1):

Open [`docker-compose-prod.yaml`](docker-compose-prod.yaml:1) and add your production environment variables:

```yaml
environment:
  - NODE_ENV=production
  - NEXT_TELEMETRY_DISABLED=1
  - YOUR_ENV_VAR=value # Add your specific environment variables
```

2. **Start the production container:**

```bash
docker compose -f docker-compose-prod.yaml up -d
```

3. **View logs:**

```bash
docker compose -f docker-compose-prod.yaml logs -f app
```

5. **Stop the production container:**

```bash
docker compose -f docker-compose-prod.yaml down
```

### Production Configuration

The production Dockerfile includes:

- Multi-stage build for optimized image size
- Non-root user execution for security
- Optimized production build
- Health check support
- Exposed port 3000

## Environment Variables

Create a `.env` file in the root directory (not in Docker) and add your environment variables:

```bash
# Example environment variables
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
# Add your specific environment variables here
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, change the port mapping:

```bash
docker run -p 3001:3000 --name publishers-landing publishers-landing:latest
```

Or update docker-compose.yml with the desired port.

### Build Issues

If you encounter build issues:

1. **Clear Docker cache:**

```bash
docker system prune -a
```

2. **Check Node version:**
   Ensure you're using Node.js 20 or higher as specified in the Dockerfiles.

3. **Verify dependencies:**
   Check that `package.json` has all required dependencies and `package-lock.json` is up to date.

### Permission Issues

If you encounter permission issues with mounted volumes:

1. **Check file permissions:**

```bash
ls -la
```

2. **Fix permissions:**

```bash
sudo chown -R $USER:$USER .
```

### Hot Reload Not Working

If hot reload isn't working in development:

1. **Verify volume mounts:**
   Check that the source code is mounted in [`docker-compose-dev.yaml`](docker-compose-dev.yaml:8).
2. **Check file changes:**
   Ensure you're editing files in the local directory, not in the container.

## Advanced Usage

### Multi-Container Setup

For production, you might want to run multiple services:

1. **Create a production docker-compose.yml** with services like:
   - Frontend (this app)
   - Backend API
   - Database
   - Redis (for caching)

2. **Example production docker-compose.yml:**

```yaml
version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
    ports:
      - "3000:3000"
    depends_on:
      - backend
      - database
    restart: unless-stopped

  backend:
    image: your-backend-image
    environment:
      - DATABASE_URL=postgresql://user:password@database:5432/dbname
    depends_on:
      - database
    restart: unless-stopped

  database:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=dbname
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

volumes:
  postgres_data:
```

### Custom Build Arguments

You can pass custom build arguments:

```bash
docker build --build-arg NODE_ENV=production -t publishers-landing:latest .
```

### Custom Ports

In production, you might want to use a different port:

```bash
docker run -p 80:3000 --name publishers-landing publishers-landing:latest
```

## Security Considerations

1. **Non-root user:** Both Dockerfiles run as non-root users
2. **Environment variables:** Never hardcode secrets in Dockerfiles
3. **Network security:** Use Docker networks for inter-container communication
4. **Image scanning:** Scan images for vulnerabilities using tools like Trivy
5. **Secrets management:** Use Docker secrets for sensitive data in production

## Performance Tips

1. **Multi-stage builds:** The production Dockerfile uses multi-stage builds to minimize image size
2. **Layer caching:** Docker builds cache layers, so rebuilds are faster
3. **Alpine base images:** Uses `node:20-alpine` for smaller image size
4. **Health checks:** Production setup includes health checks for monitoring

## Support

For issues or questions:

1. Check the project's main [README.md](README.md:1)
2. Review [GETTING_STARTED.md](GETTING_STARTED.md:1)
3. Check Docker logs: `docker compose -f docker-compose-dev.yaml logs -f app` (development) or `docker compose -f docker-compose-prod.yaml logs -f app` (production)

## License

This Docker setup is part of the publishers-landing project.
