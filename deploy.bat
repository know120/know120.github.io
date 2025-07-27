@echo off
echo Building React app for GitHub Pages...
call npm run build:github

echo.
echo Build complete! The docs folder is ready for deployment.
echo.
echo Next steps:
echo 1. git add .
echo 2. git commit -m "Deploy updated portfolio"
echo 3. git push origin main
echo.
echo Your site will be available at: https://know120.github.io/
pause