Set-Location 'C:\Users\sohoo\Desktop\ramap\backend'
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        $name = $Matches[1].Trim()
        $value = $Matches[2].Trim()
        [System.Environment]::SetEnvironmentVariable($name, $value, 'Process')
    }
}
Write-Host "JWT_SECRET loaded: $($env:JWT_SECRET.Substring(0,10))..."
& '.\gradlew.bat' bootRun --no-daemon
