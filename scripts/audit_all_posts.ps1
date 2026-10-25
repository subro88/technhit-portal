$slugs = Get-ChildItem -Path ".\content\linux-server-admin" -Filter "*.mdx" | ForEach-Object { $_.BaseName }

$passed = 0
$failed = 0
$total = $slugs.Count * 2

Write-Host "=========================================================="
Write-Host "AUDITING $($slugs.Count) POSTS ACROSS BLOG AND LEARNING MODES ($total CHECKS)"
Write-Host "=========================================================="

foreach ($slug in $slugs) {
    $blogUrl = "http://localhost:3000/linux-server-admin/" + $slug
    $learnUrl = "http://localhost:3000/linux-server-admin/" + $slug + "?mode=learning"

    $blogCode = (& curl.exe -s -o NUL -w "%{http_code}" $blogUrl).Trim()
    if ($blogCode -eq "200") {
        Write-Host "[BLOG 200]  -> $slug" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "[BLOG FAIL ($blogCode)] -> $slug" -ForegroundColor Red
        $failed++
    }

    $learnCode = (& curl.exe -s -o NUL -w "%{http_code}" $learnUrl).Trim()
    if ($learnCode -eq "200") {
        Write-Host "[LEARN 200] -> $slug" -ForegroundColor Cyan
        $passed++
    } else {
        Write-Host "[LEARN FAIL ($learnCode)] -> $slug" -ForegroundColor Red
        $failed++
    }
}

Write-Host "=========================================================="
Write-Host "RESULT: TOTAL $total | PASSED: $passed | FAILED: $failed"
Write-Host "=========================================================="

if ($failed -gt 0) {
    exit 1
} else {
    exit 0
}
