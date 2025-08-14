# Client Dockerfile: runtime-only image that serves prebuilt dist via nginx
FROM nginx:1.25-alpine
WORKDIR /var/www/dist_pragmatism

# Copy prebuilt SPA output (no build in this image)
COPY dist/ /var/www/dist_pragmatism/

# Use per-client nginx config (avoid hardcoding in Dockerfile)
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:80/ > /dev/null 2>&1 || exit 1
