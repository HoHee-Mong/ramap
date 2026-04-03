@echo off
for /f "tokens=1,* delims==" %%a in ('type .env ^| findstr /v "^#" ^| findstr "="') do (
    set "%%a=%%b"
)
gradlew.bat bootRun --no-daemon
