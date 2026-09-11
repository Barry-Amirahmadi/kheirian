@echo off
REM Double-click launcher for publishing to GitHub Pages.
REM
REM Publishes the built output to a `gh-pages` branch as a fresh, single-commit
REM repository each time. The branch holds a build artifact, not history, so
REM force-pushing a clean tree is simpler and safer than trying to keep a
REM worktree in sync -- and it can never carry a stale file forward.
setlocal

cd /d "%~dp0"

echo.
echo ================================================
echo   Kheirian site - publish to GitHub Pages
echo ================================================
echo.

REM --- 1. Where does this push to? ----------------------------------------
for /f "delims=" %%r in ('git remote get-url origin 2^>nul') do set "ORIGIN=%%r"
if not defined ORIGIN (
    echo   ERROR: no `origin` remote is set on this repository.
    echo.
    echo   Create an empty PUBLIC repo named "kheirian" on GitHub, then run:
    echo       git remote add origin https://github.com/^<your-user^>/kheirian.git
    echo       git push -u origin main
    echo.
    echo   GitHub Pages needs the repo to be public on a free plan.
    goto done
)
echo [1/3] Publishing to: %ORIGIN%

REM --- 2. Build with the subdirectory config ------------------------------
echo.
echo [2/3] Building for the /kheirian subpath...
call npm run build:pages
if errorlevel 1 (
    echo.
    echo   ERROR: the build failed. Nothing was published.
    goto done
)
if not exist "out\.nojekyll" (
    echo.
    echo   ERROR: out\.nojekyll is missing. Without it GitHub strips the
    echo   _next folder and every script and stylesheet 404s.
    goto done
)

REM --- 3. Push the output --------------------------------------------------
echo.
echo [3/3] Pushing the built site to the gh-pages branch...
if exist ".ghpages" rmdir /s /q ".ghpages"
mkdir ".ghpages"
REM /H copies hidden files, which is how .nojekyll survives.
xcopy "out" ".ghpages" /E /I /H /Y >nul
if errorlevel 1 (
    echo   ERROR: could not stage the output.
    goto done
)

pushd ".ghpages"
git init -q
git checkout -q -b gh-pages
git add -A
git -c user.name="Barry" -c user.email="hesam.nadi8213@yahoo.com" commit -q -m "Publish site"
git push -q --force "%ORIGIN%" gh-pages
set "PUSHED=%errorlevel%"
popd
rmdir /s /q ".ghpages"

if not "%PUSHED%"=="0" (
    echo.
    echo   ERROR: the push failed. Check that the remote exists and you are
    echo   signed in - a browser window may have opened for GitHub sign-in.
    goto done
)

echo.
echo ================================================
echo   Published.
echo.
echo   One-time setup, on GitHub:
echo     Settings - Pages - Source: "Deploy from a branch"
echo     Branch: gh-pages  /  (root)  - Save
echo.
echo   Then the site is at:
echo     https://^<your-user^>.github.io/kheirian/
echo ================================================

:done
echo.
echo Press any key to close this window.
pause >nul
endlocal
