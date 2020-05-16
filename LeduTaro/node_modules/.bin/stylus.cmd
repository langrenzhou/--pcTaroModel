@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\@tarojs\webpack-runner\node_modules\stylus\bin\stylus" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\..\@tarojs\webpack-runner\node_modules\stylus\bin\stylus" %*
)