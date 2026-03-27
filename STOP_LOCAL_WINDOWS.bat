@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0STOP_LOCAL_WINDOWS.ps1"
exit /b %ERRORLEVEL%
