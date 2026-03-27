@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0RUN_ME_WINDOWS.ps1" %*
exit /b %ERRORLEVEL%
