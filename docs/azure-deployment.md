# Azure Deployment Guide

This project can run as a containerized Node.js app or as a code-based deployment on Azure App Service. The guidance below covers the minimal steps to ship the current build artifacts and align runtime configuration with Azure defaults.

## Container workflow (recommended)
1. **Build the image** locally or in CI:
   ```bash
   docker build -t <registry>.azurecr.io/boreal-financial:latest .
   ```
   The multi-stage Dockerfile installs dev dependencies for the build step, produces the optimized client and server bundles in `dist/`, and keeps only production dependencies in the runtime image.
2. **Push to Azure Container Registry (ACR):**
   ```bash
   az acr login --name <registry>
   docker push <registry>.azurecr.io/boreal-financial:latest
   ```
3. **Create/Update the Web App for Containers:**
   ```bash
   az webapp create \
     --resource-group <resource-group> \
     --plan <app-service-plan> \
     --name <app-name> \
     --deployment-container-image-name <registry>.azurecr.io/boreal-financial:latest
   ```
4. **Configure app settings** (App Service > Settings > Configuration):
   - `PORT=8080` and `WEBSITES_PORT=8080` (matches the container `EXPOSE 8080` and server fallback).
   - `NODE_ENV=production`
   - Any database credentials or API keys your environment requires (for example, `DATABASE_URL`, `ALLOWED_ORIGINS`).
5. **Restart and verify:** Use the `/api/health` endpoint to confirm readiness: `https://<app-name>.azurewebsites.net/api/health`.

## Code-based App Service deployment
If you deploy without a custom container, Azure App Service will run `npm ci --no-audit --no-fund`, `npm run build`, and then `npm start` by default. Ensure the following settings are present in your App Service configuration:

- `PORT` set to the inbound port (App Service typically sets this automatically).
- `NODE_ENV=production`.
- Any additional environment variables for data stores or integrations.

After deployment, validate the site and the `/api/health` endpoint. Logs are available from the App Service "Log stream" blade.

## Notes and considerations
- The health endpoint returns JSON with uptime and a timestamp to support Azure availability probes.
- Static assets and the server bundle are output to `dist/` during the build; the runtime image only needs that directory plus production dependencies.
- For managed Postgres on Azure (e.g., Azure Database for PostgreSQL or Neon), set `DATABASE_URL` accordingly and confirm network access rules from the App Service.
- If you use custom domains or HTTPS, configure them through the App Service custom domain and TLS/SSL settings after deployment.
