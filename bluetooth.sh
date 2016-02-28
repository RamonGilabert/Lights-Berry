#!/usr/bin/expect -f

set prompt "#"
set address [lindex $argv 0]

spawn sudo hciconfig hci0 up
spawn sudo bluetoothctl -a
expect -re $prompt
send "discoverable on\r"
sleep 1
expect -re $prompt
send "remove $address\r"
sleep 1
expect -re $prompt
send "scan on\r"
sleep 10
expect "HC-06"
send "scan off\r"
expect "Controller"
send "trust $address\r"
sleep 2
send "pair $address\r"
sleep 6
send "0000\r"
sleep 3
send "quit\r"
expect eof
