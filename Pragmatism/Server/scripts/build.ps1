$env:GOARCH = "amd64"
$env:GOOS = "linux"

go build -o ./bin/PragmatismApp ./cmd/app/main.go