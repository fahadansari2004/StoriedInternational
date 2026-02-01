@echo off
echo Starting local server for Storied International website...
echo.
echo Open in your browser:
echo   Main site: http://localhost:3000/index.html
echo   Admin:     http://localhost:3000/admin.html
echo.
echo Press Ctrl+C to stop the server
echo.
python -m http.server 3000
