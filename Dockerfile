# BUILDER
FROM node:20.9-alpine AS builder

ARG WIPP_FRONTEND="WIPP-frontend"

# Set working directory
WORKDIR /app

# Build app
COPY package*.json ./
RUN npm ci --force
COPY . .
RUN npm run build -- --configuration production

# Copy WIPP frontend config
COPY deploy/docker/config.json dist/${WIPP_FRONTEND}/assets/config/config.json

# RUNTIME
FROM nginx:1.29-alpine
LABEL org.opencontainers.image.authors="National Institute of Standards and Technology"

ARG WIPP_FRONTEND="WIPP-frontend"

# Set working directory
WORKDIR /var/www/

# Copy WIPP frontend application
COPY --from=builder /app/dist/${WIPP_FRONTEND} frontend

# Copy nginx configuration and entrypoint script
COPY deploy/docker/default.conf /etc/nginx/conf.d/default.conf
COPY deploy/docker/nginx.conf /etc/nginx/nginx.conf
COPY deploy/docker/entrypoint.sh /usr/local/bin/entrypoint.sh

# Entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
