# Building the docker images and push to container registry
- `docker build -t "ghcr.io/karthik-shenoy/projects-mono-repo/pragmatism-client:latest" -f Client/Dockerfile Client`
- `docker login ghcr.io -u $env:GITHUB_USERNAME --password $env:GITHUB_TOKEN`                                   