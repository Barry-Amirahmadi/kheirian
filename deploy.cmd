@echo off
REM Double-click launcher for deploying the site to Cloudflare Pages.
REM Exists because the deploy needs a terminal whose working directory is
REM this folder, and remembering that every time is how a deploy gets run
REM from the wrong place and silently uploads nothing.
setlocal

cd /d "%~dp0"
echo.
echo ================================================
echo   Kheirian packaging site - Cloudflare deploy
echo ================================================
echo   folder: %CD%
echo.

REM --- 1. Cloudflare account -----------------------------------------------
echo [1/4] Checking Cloudflare login...
call npx wrangler whoami >nul 2>&1
if errorlevel 1 (
    echo       Not logged in. A browser window will open - click "Allow".
    echo.
    call npx wrangler login
    if errorlevel 1 (
        echo.
        echo   ERROR: login failed. Nothing was deployed.
        goto :done
    )
) else (
    echo       Already logged in.
)

REM --- 2. Pages project ----------------------------------------------------
echo.
echo [2/4] Making sure the Pages project exists...
call npx wrangler pages project list 2>nul | findstr /C:"kheirian" >nul
if errorlevel 1 (
    echo       Creating project "kheirian"...
    call npx wrangler pages project create kheirian --production-branch=main
    if errorlevel 1 (
        echo.
        echo   ERROR: could not create the project. Nothing was deployed.
        echo   If the name is taken, pick another one and update
        echo   SITE.url in src\app\layout.tsx to match.
        goto :done
    )
) else (
    echo       Project "kheirian" already exists.
)

REM --- 3. Build ------------------------------------------------------------
echo.
echo [3/4] Building the static export...
call npm run build
if errorlevel 1 (
    echo.
    echo   ERROR: the build failed. Nothing was deployed.
    goto :done
)

REM --- 4. Upload -----------------------------------------------------------
echo.
echo [4/4] Uploading to Cloudflare Pages...
call npx wrangler pages deploy out --project-name=kheirian
if errorlevel 1 (
    echo.
    echo   ERROR: the upload failed.
    goto :done
)

echo.
echo ================================================
echo   Done. The URL is printed just above.
echo ================================================

:done
echo.
echo Press any key to close this window.
pause >nul
endlocal
