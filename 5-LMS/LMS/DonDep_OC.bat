@echo off
chcp 65001 >nul
:: Tu dong yeu cau quyen Administrator (UAC)
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Dang yeu cau quyen Administrator...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo Dang don dep thu muc goc o C:...

:: 1. Chuyen cac file tai lieu Strawberry Perl vao C:\perl\
if not exist "C:\perl" mkdir "C:\perl"
if exist "C:\DISTRIBUTIONS.txt" move /y "C:\DISTRIBUTIONS.txt" "C:\perl\"
if exist "C:\README.txt" move /y "C:\README.txt" "C:\perl\"
if exist "C:\relocation.txt" move /y "C:\relocation.txt" "C:\perl\"

:: 2. Xoa cac file rac, log, temp va DLL thua
if exist "C:\WRP71C5.tmp" del /f /q "C:\WRP71C5.tmp"
if exist "C:\RHDSetup.log" del /f /q "C:\RHDSetup.log"
if exist "C:\mylog.log" del /f /q "C:\mylog.log"
if exist "C:\logUploaderSettings.ini" del /f /q "C:\logUploaderSettings.ini"
if exist "C:\logUploaderSettings_temp.ini" del /f /q "C:\logUploaderSettings_temp.ini"
if exist "C:\appverifUI.dll" del /f /q "C:\appverifUI.dll"
if exist "C:\vfcompat.dll" del /f /q "C:\vfcompat.dll"

echo ==============================================
echo Hoan tat! Thu muc goc o C da duoc don dep sach se.
echo ==============================================
pause
