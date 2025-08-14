# Server Dockerfile: runtime-only image that copies the prebuilt binary and assets
FROM alpine:3.20
WORKDIR /app

# Copy prebuilt Linux binary and public assets
COPY bin/PragmatismApp /app/PragmatismApp
COPY public/ /app/public/

# Ensure executable (certificates/timezone can be mounted via docker compose if needed)
RUN chmod +x /app/PragmatismApp

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:3000/health > /dev/null 2>&1 || exit 1
CMD ["/app/PragmatismApp"]
