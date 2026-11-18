param(
  [Parameter(Mandatory = $true)]
  [string]$Bucket,

  [Parameter(Mandatory = $true)]
  [string]$ApiUrl
)

$repoRoot = Split-Path -Parent $PSScriptRoot
$clientDir = Join-Path $repoRoot "client"

$env:VITE_API_URL = $ApiUrl

Push-Location $clientDir

try {
  npm run build

  if ($LASTEXITCODE -ne 0) {
    throw "Frontend build failed."
  }
}
finally {
  Pop-Location
}

aws s3 sync "$clientDir\dist" "s3://$Bucket" --delete

if ($LASTEXITCODE -ne 0) {
  throw "S3 upload failed."
}

Write-Host "Frontend deployment completed."