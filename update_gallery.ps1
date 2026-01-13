$ErrorActionPreference = "Stop"

# Define Paths
$baseDir = Get-Location
$jsOutputFile = Join-Path $baseDir "assets\js\gallery-data.js"

# 1. Clients (Logos) - Filter for "logo*" files in assets/img
$logosPath = Join-Path $baseDir "assets\img\logo*"
$logos = Get-ChildItem -Path $logosPath -Include *.jpg,*.png,*.jpeg,*.webp,*.svg -File | 
         Sort-Object Name | 
         Select-Object -ExpandProperty Name

# 2. Conference Images
$confPath = Join-Path $baseDir "assets\conference\*"
$conf = Get-ChildItem -Path $confPath -Include *.jpg,*.png,*.jpeg,*.webp -File | 
        Sort-Object Name | 
        Select-Object -ExpandProperty Name

# 3. Hospital Images
$hospPath = Join-Path $baseDir "assets\hospital\*"
$hosp = Get-ChildItem -Path $hospPath -Include *.jpg,*.png,*.jpeg,*.webp -File | 
        Sort-Object Name | 
        Select-Object -ExpandProperty Name

# Create Hashtable
$galleryData = @{
    logos = @($logos)
    conference = @($conf)
    hospital = @($hosp)
}

# Convert to JSON
$json = $galleryData | ConvertTo-Json -Depth 4

# Create JS Content
$jsContent = "window.galleryData = $json;"

# Write to File
Set-Content -Path $jsOutputFile -Value $jsContent -Encoding UTF8

Write-Host "Successfully updated gallery-data.js with:"
Write-Host "Logos: $(($logos).Count)"
Write-Host "Conference: $(($conf).Count)"
Write-Host "Hospital: $(($hosp).Count)"
