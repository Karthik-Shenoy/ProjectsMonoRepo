param(
    [string]$srcFolder = ".\src",
    [string]$destFolder = ".\bin",
    [string]$outputName = "Test.exe",
    [string]$tc
)

# Ensure destination folder exists
if (!(Test-Path $destFolder)) {
    Write-Error "Destination folder '$destFolder' does not exist."
}

# Build the g++ command
$outputPath = Join-Path $destFolder $outputName

# Use the tc argument if provided, otherwise find tc.cpp in src
if ($tc) {
    $tcFile = Get-ChildItem -Path $srcFolder -Recurse -Filter "$tc.cpp" | Select-Object -First 1
    if (-not $tcFile) {
        Write-Error "No test case file 'tc.cpp' found recursively in '$srcFolder'."
        exit 1
    }
} else {
    # Recursively find the tc.cpp file in src
    Write-Error "No test case file specified!"
}

$tc = $tcFile.FullName

Write-Host "Compiling..."
g++ $tc -o "$outputPath" -I "C:\KarthikWorkSpace\MinGW\include"

Write-Host "RunningTests..."
.\bin\Test.exe

if (!(Test-Path $destFolder)) {
    Write-Error "Destination folder '$destFolder' does not exist."
}

Remove-Item ".\bin\Test.exe"


