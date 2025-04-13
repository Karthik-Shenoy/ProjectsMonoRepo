$env:GOARCH = "amd64"
$env:GOOS = "windows"

.\scripts\sensitive\SetEnvVariables.ps1

go run .\cmd\app\main.go -dev=true