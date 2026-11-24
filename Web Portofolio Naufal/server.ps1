# ==============================================================================
# Fullstack Web Portfolio & REST API Server - Muhammad Naufal
# Zero Dependencies Required - Native Windows PowerShell HTTP Engine
# ==============================================================================

$port = 8080
$rootDir = $PSScriptRoot
$dataDir = Join-Path $rootDir "data"

if (-not (Test-Path $dataDir)) {
    New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
}

# Ensure data files exist
$musicFile = Join-Path $dataDir "music.json"
$recsFile = Join-Path $dataDir "recommendations.json"
$messagesFile = Join-Path $dataDir "messages.json"

if (-not (Test-Path $messagesFile)) {
    Set-Content -Path $messagesFile -Value "[]" -Encoding UTF8
}
if (-not (Test-Path $recsFile)) {
    Set-Content -Path $recsFile -Value "[]" -Encoding UTF8
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
} catch {
    Write-Host "Port $port sedang digunakan. Menggunakan port 8081..." -ForegroundColor Yellow
    $port = 8081
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
}

$url = "http://localhost:$port/"
Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  🚀 Fullstack Server Web Portofolio Naufal Berjalan!" -ForegroundColor Green
Write-Host "  🌐 Frontend:  $url" -ForegroundColor White
Write-Host "  🎧 Music API: ${url}api/music" -ForegroundColor White
Write-Host "  📬 Message API: ${url}api/messages" -ForegroundColor White
Write-Host "  Tekan Ctrl + C di jendela ini untuk mematikan server." -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# Auto open browser
Start-Process $url

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".mp3"  = "audio/mpeg"
    ".wav"  = "audio/wav"
    ".ico"  = "image/x-icon"
}

function Send-JsonResponse($response, $statusCode, $data) {
    $response.StatusCode = $statusCode
    $response.ContentType = "application/json; charset=utf-8"
    $response.AddHeader("Access-Control-Allow-Origin", "*")
    $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    $response.AddHeader("Access-Control-Allow-Headers", "Content-Type")
    
    $json = $data | ConvertTo-Json -Depth 5
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    $response.ContentLength64 = $bytes.Length
    $response.OutputStream.Write($bytes, 0, $bytes.Length)
    $response.Close()
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $method = $request.HttpMethod
        $path = $request.Url.LocalPath

        # Handle CORS Preflight OPTIONS
        if ($method -eq "OPTIONS") {
            $response.StatusCode = 204
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            $response.AddHeader("Access-Control-Allow-Headers", "Content-Type")
            $response.Close()
            continue
        }

        # ----------------------------------------------------------------------
        # REST API ROUTING
        # ----------------------------------------------------------------------

        # GET /api/music
        if ($path -eq "/api/music" -and $method -eq "GET") {
            if (Test-Path $musicFile) {
                $musicContent = Get-Content -Path $musicFile -Raw -Encoding UTF8
                $musicData = $musicContent | ConvertFrom-Json
                Send-JsonResponse $response 200 @{ success = $true; data = $musicData }
            } else {
                Send-JsonResponse $response 404 @{ success = $false; message = "Music file not found" }
            }
            continue
        }

        # POST /api/music/favorite
        if ($path -eq "/api/music/favorite" -and $method -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
            $bodyRaw = $reader.ReadToEnd()
            $body = $bodyRaw | ConvertFrom-Json
            
            if ($body -and $body.id -and (Test-Path $musicFile)) {
                $musicContent = Get-Content -Path $musicFile -Raw -Encoding UTF8
                $musicData = $musicContent | ConvertFrom-Json
                
                $updatedTrack = $null
                foreach ($t in $musicData) {
                    if ($t.id -eq $body.id) {
                        $t.isFavorite = -not $t.isFavorite
                        if ($t.isFavorite) {
                            $t.likes = [int]$t.likes + 1
                        } else {
                            $t.likes = [Math]::Max(0, [int]$t.likes - 1)
                        }
                        $updatedTrack = $t
                        break
                    }
                }
                
                $musicData | ConvertTo-Json -Depth 5 | Set-Content -Path $musicFile -Encoding UTF8
                Send-JsonResponse $response 200 @{ success = $true; message = "Favorite updated"; track = $updatedTrack }
            } else {
                Send-JsonResponse $response 400 @{ success = $false; message = "Invalid track id" }
            }
            continue
        }

        # GET /api/music/recommendations
        if ($path -eq "/api/music/recommendations" -and $method -eq "GET") {
            $recsContent = Get-Content -Path $recsFile -Raw -Encoding UTF8
            $recsData = $recsContent | ConvertFrom-Json
            Send-JsonResponse $response 200 @{ success = $true; data = $recsData }
            continue
        }

        # POST /api/music/recommend
        if ($path -eq "/api/music/recommend" -and $method -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
            $bodyRaw = $reader.ReadToEnd()
            $body = $bodyRaw | ConvertFrom-Json

            if ($body -and $body.title -and $body.artist) {
                $recsContent = Get-Content -Path $recsFile -Raw -Encoding UTF8
                $recsList = @()
                if (-not [string]::IsNullOrWhiteSpace($recsContent)) {
                    $recsList = @($recsContent | ConvertFrom-Json)
                }

                $newRec = @{
                    id = "rec-" + [guid]::NewGuid().ToString().Substring(0, 8)
                    title = $body.title
                    artist = $body.artist
                    recommender = if ($body.recommender) { $body.recommender } else { "Pengunjung Web" }
                    date = (Get-Date).ToString("yyyy-MM-dd")
                    note = if ($body.note) { $body.note } else { "" }
                }

                $recsList += $newRec
                $recsList | ConvertTo-Json -Depth 5 | Set-Content -Path $recsFile -Encoding UTF8

                Send-JsonResponse $response 201 @{ success = $true; message = "Rekomendasi lagu berhasil dikirim!"; recommendation = $newRec }
            } else {
                Send-JsonResponse $response 400 @{ success = $false; message = "Judul dan artis wajib diisi." }
            }
            continue
        }

        # POST /api/contact
        if ($path -eq "/api/contact" -and $method -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
            $bodyRaw = $reader.ReadToEnd()
            $body = $bodyRaw | ConvertFrom-Json

            if ($body -and $body.name -and $body.email -and $body.message) {
                $msgContent = Get-Content -Path $messagesFile -Raw -Encoding UTF8
                $msgList = @()
                if (-not [string]::IsNullOrWhiteSpace($msgContent)) {
                    $msgList = @($msgContent | ConvertFrom-Json)
                }

                $newMsg = @{
                    id = "msg-" + [guid]::NewGuid().ToString().Substring(0, 8)
                    name = $body.name
                    email = $body.email
                    subject = if ($body.subject) { $body.subject } else { "Umum" }
                    message = $body.message
                    createdAt = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
                }

                $msgList += $newMsg
                $msgList | ConvertTo-Json -Depth 5 | Set-Content -Path $messagesFile -Encoding UTF8

                Send-JsonResponse $response 201 @{ success = $true; message = "Pesan Anda berhasil diterima server!" }
            } else {
                Send-JsonResponse $response 400 @{ success = $false; message = "Nama, email, dan pesan wajib diisi." }
            }
            continue
        }

        # GET /api/messages
        if ($path -eq "/api/messages" -and $method -eq "GET") {
            $msgContent = Get-Content -Path $messagesFile -Raw -Encoding UTF8
            $msgList = $msgContent | ConvertFrom-Json
            Send-JsonResponse $response 200 @{ success = $true; count = ($msgList | Measure-Object).Count; data = $msgList }
            continue
        }

        # ----------------------------------------------------------------------
        # STATIC FILE SERVING
        # ----------------------------------------------------------------------
        $localPath = $path.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($localPath) -or $localPath -eq "/") {
            $localPath = "index.html"
        }

        $fullPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($rootDir, $localPath))
        if (-not $fullPath.StartsWith($rootDir, [System.StringComparison]::OrdinalIgnoreCase)) {
            $response.StatusCode = 403
            $response.Close()
            continue
        }

        if (Test-Path $fullPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $contentType
            $response.AddHeader("Access-Control-Allow-Origin", "*")

            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.StatusCode = 200
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $localPath")
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }

        $response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
