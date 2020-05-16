@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\@tarojs\runner-utils\node_modules\scss-bundle\dist\cli\main.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\..\@tarojs\runner-utils\node_modules\scss-bundle\dist\cli\main.js" %*
)