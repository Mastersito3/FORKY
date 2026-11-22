@echo off
cd /d "%~dp0"
echo Abriendo FORKY en modo de prueba...
echo Deja esta ventana abierta mientras uses la app. Cierrala para pararla.
start "" "http://localhost:8765/?local&demo"
where py >nul 2>nul && (py -m http.server 8765 & goto :eof)
where python >nul 2>nul && (python -m http.server 8765 & goto :eof)
echo.
echo No encuentro Python. Instalalo desde https://www.python.org/downloads/ (marca "Add python.exe to PATH") y vuelve a abrir este archivo.
pause
