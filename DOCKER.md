# Dahab Gold Store POS - Docker Setup

This guide will help you set up the Dahab Gold Store Point of Sale system using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your system
- [Docker Compose](https://docs.docker.com/compose/install/) installed on your system
- At least 4GB of free disk space

## Quick Start

1. **Clone the repository** (if not already done)
   ```bash
   git clone <your-repo-url>
   cd Dahab-Hackathon
   ```

2. **Run the setup script**
   ```bash
   ./setup-docker.sh
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - PocketBase Admin: http://localhost:8090/_/

## Manual Setup

If you prefer to set up manually:

### 1. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` file as needed:
```env
NODE_ENV=production
NEXT_PUBLIC_POCKETBASE_URL=http://localhost:8090
NEXT_POCKETBASE=http://localhost:8090
POCKETBASE_ADMIN_EMAIL=admin@dahab.com
POCKETBASE_ADMIN_PASSWORD=admin123456
```

### 2. Production Deployment

Build and start the services:
```bash
# Build the images
docker-compose build

# Start the services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 3. Development Environment

For development with hot reload:
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

## Services

### Frontend (Next.js)
- **Port**: 3000
- **Environment Variables**:
  - `NEXT_PUBLIC_POCKETBASE_URL`: Public URL for client-side PocketBase access
  - `NEXT_POCKETBASE`: Server-side URL for PocketBase access
  - `NODE_ENV`: Environment (production/development)

### Backend (PocketBase)
- **Port**: 8090
- **Admin Panel**: http://localhost:8090/_/
- **API Endpoint**: http://localhost:8090/api/
- **Data Directory**: `./pb_data`
- **Migrations**: `./pb_migrations`

## Default Credentials

### PocketBase Admin
- **Email**: admin@dahab.com
- **Password**: admin123456

⚠️ **Important**: Change these credentials in production!

## Docker Commands

### Basic Operations
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f dahab-pos
docker-compose logs -f pocketbase
```

### Development Commands
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# Rebuild development containers
docker-compose -f docker-compose.dev.yml build --no-cache
```

### Data Management
```bash
# Backup PocketBase data
docker-compose exec pocketbase tar -czf /tmp/pb_backup.tar.gz /pb_data
docker cp $(docker-compose ps -q pocketbase):/tmp/pb_backup.tar.gz ./pb_backup.tar.gz

# Restore PocketBase data
docker cp ./pb_backup.tar.gz $(docker-compose ps -q pocketbase):/tmp/
docker-compose exec pocketbase tar -xzf /tmp/pb_backup.tar.gz -C /
```

## Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check if ports are in use
   lsof -i :3000
   lsof -i :8090
   
   # Change ports in docker-compose.yml if needed
   ```

2. **Permission issues with PocketBase data**
   ```bash
   # Fix permissions
   sudo chown -R $USER:$USER ./pb_data
   ```

3. **Container build failures**
   ```bash
   # Clean rebuild
   docker-compose down
   docker system prune -f
   docker-compose build --no-cache
   ```

4. **PocketBase not accessible**
   ```bash
   # Check container logs
   docker-compose logs pocketbase
   
   # Check if container is running
   docker-compose ps
   ```

### Health Checks

The PocketBase service includes health checks. You can monitor service health:
```bash
# Check service status
docker-compose ps

# View health check logs
docker-compose logs pocketbase | grep health
```

## Production Considerations

### Security
1. Change default PocketBase admin credentials
2. Use strong passwords
3. Consider setting up SSL/TLS
4. Restrict PocketBase admin access

### Performance
1. Configure resource limits in docker-compose.yml
2. Set up log rotation
3. Monitor disk usage for PocketBase data
4. Consider using external database for large deployments

### Backup Strategy
1. Regular backups of `./pb_data` directory
2. Database exports via PocketBase admin panel
3. Container image backups

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Node.js environment | `production` |
| `NEXT_PUBLIC_POCKETBASE_URL` | Client-side PocketBase URL | `http://localhost:8090` |
| `NEXT_POCKETBASE` | Server-side PocketBase URL | `http://pocketbase:8090` |
| `POCKETBASE_ADMIN_EMAIL` | PocketBase admin email | `admin@dahab.com` |
| `POCKETBASE_ADMIN_PASSWORD` | PocketBase admin password | `admin123456` |

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Review container logs
3. Ensure all prerequisites are met
4. Check Docker and Docker Compose versions

## License

This project is licensed under the MIT License.
