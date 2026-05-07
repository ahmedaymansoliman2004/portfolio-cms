$ErrorActionPreference = "Stop"

$root = Get-Location
$heroPath = Join-Path $root "src\sections\Hero.jsx"
$cssPath = Join-Path $root "src\index.css"

if (!(Test-Path $heroPath)) {
    Write-Host "ERROR: src\sections\Hero.jsx not found. Run this script from the project root folder beside package.json." -ForegroundColor Red
    exit 1
}

if (!(Test-Path $cssPath)) {
    Write-Host "ERROR: src\index.css not found. Run this script from the project root folder beside package.json." -ForegroundColor Red
    exit 1
}

Copy-Item $heroPath "$heroPath.bak" -Force
Copy-Item $cssPath "$cssPath.bak" -Force

$hero = Get-Content $heroPath -Raw

# Add a stable class to the first section inside Hero.jsx so the responsive CSS targets only the home section.
if ($hero -notmatch "portfolio-home-hero") {
    if ($hero -match '<section([^>]*?)className="([^"`n]*?)"') {
        $hero = [regex]::Replace($hero, '<section([^>]*?)className="([^"`n]*?)"', '<section$1className="portfolio-home-hero $2"', 1)
    } else {
        $hero = [regex]::Replace($hero, '<section', '<section className="portfolio-home-hero"', 1)
    }
}

# Remove rigid viewport heights that cause the hero to look cut on short laptop screens.
$hero = $hero -replace '\bh-screen\b', 'min-h-[calc(100svh-72px)]'
$hero = $hero -replace '\bmin-h-screen\b', 'min-h-[calc(100svh-72px)]'

Set-Content $heroPath $hero -Encoding UTF8

$cssFix = @'

/* Home responsive fix: keeps the hero complete on small desktop/laptop heights */
.portfolio-home-hero {
  min-height: calc(100svh - 72px) !important;
  height: auto !important;
  padding-top: clamp(72px, 9vh, 112px) !important;
  padding-bottom: clamp(20px, 4vh, 56px) !important;
  overflow: visible !important;
}

.portfolio-home-hero h1 {
  font-size: clamp(4rem, 8vw, 8.25rem) !important;
  line-height: 0.88 !important;
}

.portfolio-home-hero img[src*="profile"],
.portfolio-home-hero img[alt*="Ahmed"],
.portfolio-home-hero img[alt*="أحمد"] {
  width: clamp(280px, 28vw, 430px) !important;
  height: clamp(280px, 28vw, 430px) !important;
  object-fit: cover !important;
}

@media (min-width: 1024px) and (max-height: 850px) {
  .portfolio-home-hero {
    min-height: calc(100svh - 68px) !important;
    padding-top: 70px !important;
    padding-bottom: 18px !important;
  }

  .portfolio-home-hero h1 {
    font-size: clamp(3.6rem, 6.6vw, 6.3rem) !important;
    line-height: 0.9 !important;
  }

  .portfolio-home-hero p {
    margin-top: 0.7rem !important;
    margin-bottom: 0.7rem !important;
  }

  .portfolio-home-hero img[src*="profile"],
  .portfolio-home-hero img[alt*="Ahmed"],
  .portfolio-home-hero img[alt*="أحمد"] {
    width: clamp(260px, 25vw, 360px) !important;
    height: clamp(260px, 25vw, 360px) !important;
  }

  .portfolio-home-hero [class*="gap-"] {
    row-gap: 1.5rem !important;
  }
}

@media (min-width: 1024px) and (max-height: 740px) {
  .portfolio-home-hero {
    align-items: flex-start !important;
    padding-top: 64px !important;
    padding-bottom: 12px !important;
  }

  .portfolio-home-hero h1 {
    font-size: clamp(3rem, 5.8vw, 5rem) !important;
    line-height: 0.92 !important;
  }

  .portfolio-home-hero img[src*="profile"],
  .portfolio-home-hero img[alt*="Ahmed"],
  .portfolio-home-hero img[alt*="أحمد"] {
    width: clamp(230px, 23vw, 320px) !important;
    height: clamp(230px, 23vw, 320px) !important;
  }

  .portfolio-home-hero [class*="py-"] {
    padding-top: 0.4rem !important;
    padding-bottom: 0.4rem !important;
  }
}

@media (max-width: 1023px) {
  .portfolio-home-hero {
    min-height: auto !important;
    padding-top: 96px !important;
    padding-bottom: 48px !important;
  }

  .portfolio-home-hero h1 {
    font-size: clamp(3rem, 14vw, 5.5rem) !important;
  }
}
'@

$css = Get-Content $cssPath -Raw
if ($css -notmatch "Home responsive fix: keeps the hero complete") {
    Add-Content $cssPath $cssFix -Encoding UTF8
}

Write-Host "Done. Updated:" -ForegroundColor Green
Write-Host "- src\sections\Hero.jsx"
Write-Host "- src\index.css"
Write-Host "Backups created:" -ForegroundColor Yellow
Write-Host "- src\sections\Hero.jsx.bak"
Write-Host "- src\index.css.bak"
