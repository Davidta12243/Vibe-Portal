Write-Host "========================================================" -ForegroundColor Red
Write-Host "  DANG DUNG HE THONG 7 WEB (PORTS 3000-3006)" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Red

$ports = 3000..3006
foreach ($p in $ports) {
    $conns = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue
    if ($conns) {
        $pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($procId in $pids) {
            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
            Write-Host "[x] Da dung Port $p (PID: $procId)" -ForegroundColor Green
        }
    } else {
        Write-Host "[-] Port $p khong hoat dong" -ForegroundColor DarkGray
    }
}

Write-Host "========================================================" -ForegroundColor Red
Write-Host "  DA DUNG TOAN BO CAC CUA SO WEB!" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Red
