$ports = @(8081, 19000, 19001, 19002)
   $wslIP = (wsl hostname -I).Trim()
   
   foreach ($port in $ports) {
       netsh interface portproxy add v4tov4 listenport=$port listenaddress=0.0.0.0 connectport=$port connectaddress=$wslIP
   }
   
   Write-Host "Port forwarding configured for WSL IP: $wslIP"