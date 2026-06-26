@"
src\app\otp
src\app\chat
src\app\settings
src\app\api\auth\send-otp
src\app\api\auth\verify-otp
src\app\api\chat
src\components
src\lib\supabase
src\hooks
src\types
src\context
public
"@ -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" } | ForEach-Object { New-Item -ItemType Directory -Force -Path $_ }
