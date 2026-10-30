# Vibe Studio - Start all 7 apps
$baseDir = $PSScriptRoot

$apps = @(
    @{ Name = "0. Portal [Port 3000]"; Path = "0-Vibe portal\shadcn-landing-page"; Port = 3000 },
    @{ Name = "1. Shop [Port 3001]"; Path = "1-Shop\ShopeeClone"; Port = 3001 },
    @{ Name = "2. Food [Port 3002]"; Path = "2-Food-Selling\food-ecommerce-app"; Port = 3002 },
    @{ Name = "3. PC [Port 3003]"; Path = "3-Computer-Service\pc-builder"; Port = 3003 },
    @{ Name = "4. Travel [Port 3004]"; Path = "4-Booking-Office\fullstack-nextjs-golobe-travel-agency"; Port = 3004 },
    @{ Name = "5. Edu [Port 3005]"; Path = "5-LMS\LMS"; Port = 3005 },
    @{ Name = "6. Live [Port 3006]"; Path = "6-Livestream\04-sub-livestream"; Port = 3006 }
)

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  🌟 DANG KHOI DONG HE THONG 7 WEB VIBE STUDIO (3000-3006)" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

foreach ($app in $apps) {
    $fullPath = Join-Path $baseDir $app.Path
    Write-Host "-> Khoi dong $($app.Name)..." -ForegroundColor Green
    Start-Process cmd.exe -ArgumentList "/k title $($app.Name) && cd /d `"$fullPath`" && npm run dev"
    Start-Sleep -Milliseconds 800
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "  DA KHOI DONG XONG! Vui long kiem tra 7 cua so terminal:" -ForegroundColor Yellow
Write-Host "  - Web Tong (Portal) : http://localhost:3000" -ForegroundColor White
Write-Host "  - 1. Shop           : http://localhost:3001" -ForegroundColor White
Write-Host "  - 2. Food           : http://localhost:3002" -ForegroundColor White
Write-Host "  - 3. PC Builder     : http://localhost:3003" -ForegroundColor White
Write-Host "  - 4. Travel Booking : http://localhost:3004" -ForegroundColor White
Write-Host "  - 5. Edu LMS        : http://localhost:3005" -ForegroundColor White
Write-Host "  - 6. Livestream     : http://localhost:3006" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Cyan
