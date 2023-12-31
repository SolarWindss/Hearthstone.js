@echo off
rmdir /S /Q dist > NUL 2>&1
echo Building...
tsc && echo Done && npm start
