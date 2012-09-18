@echo off
set PATH=\
echo Running jsHint
C:\Windows\System32\cscript.exe jsHint\wsh.js ..\src\fatBoy.js
echo Running ajaxMin
minify\ajaxmin -clobber ..\src\fatBoy.js -o ..\jquery.fatboy.min.js
echo ----------------------------------------------
