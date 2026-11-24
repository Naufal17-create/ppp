@echo off
title Local Server Web Portofolio Naufal
echo Memulai server lokal web portofolio...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
