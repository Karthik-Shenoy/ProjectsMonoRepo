FROM postgres:16-alpine

ENV POSTGRES_USER=postgres \
    POSTGRES_PASSWORD=12345678 \
    POSTGRES_DB=Pragmatism

# Place your SQL seed file next to this Dockerfile
COPY PragmatismData.sql /docker-entrypoint-initdb.d/20_PragmatismData.sql
# Note: init scripts in /docker-entrypoint-initdb.d run only on first container start (empty data dir).
# To re-seed, remove the data volume or use a different one.

EXPOSE 5432

