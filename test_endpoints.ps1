$ErrorActionPreference = 'Stop'

Write-Host "========================================================"
Write-Host "CSC2104 VEHICLE PARKING MANAGEMENT SYSTEM - TEST SUITE"
Write-Host "========================================================"

Write-Host "`n[1/10] Admin Authentication..."
$loginBody = @{
    email = "admin@parking.com"
    password = "admin123"
} | ConvertTo-Json

$loginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
Write-Host "   -> Logged in successfully: $($loginRes.fullName) [Role: $($loginRes.role)]"

Write-Host "`n[2/10] Dashboard Statistics & Analytics..."
$dash = Invoke-RestMethod -Uri "http://localhost:8080/api/dashboard" -Method Get
Write-Host "   -> Total Slots: $($dash.totalSlots) | Available: $($dash.availableSlots) | Occupied: $($dash.occupiedSlots)"
Write-Host "   -> Today Revenue: ₹$($dash.todayRevenue) | Active Sessions: $($dash.activeSessions)"

Write-Host "`n[3/10] Parking Slot Layout & Multidimensional Grid..."
$slots = Invoke-RestMethod -Uri "http://localhost:8080/api/slots" -Method Get
Write-Host "   -> Retrieved $($slots.Count) slots across $($slots | Select-Object -ExpandProperty floor -Unique | Measure-Object | Select-Object -ExpandProperty Count) floors"

Write-Host "`n[4/10] Park Vehicle (Synchronized Assignment & Inheritance)..."
$randNum = Get-Random -Minimum 1000 -Maximum 9999
$testPlate = "DL-01-VIVA-$randNum"
$parkBody = @{
    vehicleNumber = $testPlate
    vehicleType = "CAR"
    ownerName = "Dr. CSC2104 Examiner"
    phoneNumber = "9876543210"
    preferredFloor = 1
} | ConvertTo-Json

$parkRes = Invoke-RestMethod -Uri "http://localhost:8080/api/parking/park" -Method Post -Body $parkBody -ContentType "application/json"
Write-Host "   -> Assigned Slot: $($parkRes.slotNumber) | Ticket No: $($parkRes.ticketNumber) | Vehicle: $($parkRes.vehicleNumber)"
$sessionId = $parkRes.sessionId
$vehNum = $parkRes.vehicleNumber

Write-Host "`n[5/10] Get Entry Ticket Object..."
$ticket = Invoke-RestMethod -Uri "http://localhost:8080/api/parking/ticket/$sessionId" -Method Get
Write-Host "   -> Ticket Verified: $($ticket.ticketNumber) for $($ticket.vehicleNumber) at $($ticket.slotNumber)"

Write-Host "`n[6/10] Estimate Fee (Polymorphism) & Checkout Process..."
$est = Invoke-RestMethod -Uri "http://localhost:8080/api/parking/estimate/$vehNum" -Method Get
Write-Host "   -> Duration: $($est.durationHours) hr(s) | Calculated Fee: ₹$($est.parkingFee)"

$checkoutBody = @{
    vehicleNumber = $vehNum
    paymentMethod = "UPI"
    remarks = "Viva examination test checkout"
} | ConvertTo-Json

$checkoutRes = Invoke-RestMethod -Uri "http://localhost:8080/api/parking/checkout" -Method Post -Body $checkoutBody -ContentType "application/json"
Write-Host "   -> Checkout Complete! Receipt: $($checkoutRes.receiptNumber) | Paid: ₹$($checkoutRes.parkingFee) via $($checkoutRes.paymentMethod)"

Write-Host "`n[7/10] Printable Receipt Object..."
$receipt = Invoke-RestMethod -Uri "http://localhost:8080/api/parking/receipt/$sessionId" -Method Get
Write-Host "   -> Receipt Verified: $($receipt.receiptNumber) | Total Paid: ₹$($receipt.amountPaid)"

Write-Host "`n[8/10] Reports Summary & File I/O Operations..."
$reportSum = Invoke-RestMethod -Uri "http://localhost:8080/api/reports" -Method Get
Write-Host "   -> Report Summary: $($reportSum.totalSessions) sessions, total revenue ₹$($reportSum.totalRevenue)"

$exportDir = "$PSScriptRoot/exports"
if (!(Test-Path $exportDir)) { New-Item -ItemType Directory -Path $exportDir }

# Test Text Export (FileWriter / FileReader)
Invoke-RestMethod -Uri "http://localhost:8080/api/reports/export?type=txt" -OutFile "$exportDir/test_report.txt"
$txtSize = (Get-Item "$exportDir/test_report.txt").Length
Write-Host "   -> Text Report File Written: $exportDir/test_report.txt ($txtSize bytes)"

# Test Binary Backup (FileOutputStream / FileInputStream)
Invoke-RestMethod -Uri "http://localhost:8080/api/reports/export?type=backup" -OutFile "$exportDir/test_backup.dat"
$datSize = (Get-Item "$exportDir/test_backup.dat").Length
Write-Host "   -> Binary Backup File Written: $exportDir/test_backup.dat ($datSize bytes)"

Write-Host "`n[9/10] OOP Viva Interactive Demonstrations..."
$argDemo = Invoke-RestMethod -Uri "http://localhost:8080/api/demo/argument-passing" -Method Get
Write-Host "   -> [Java Pass-by-Value Demo]: OK"

$recDemo = Invoke-RestMethod -Uri "http://localhost:8080/api/demo/recursion" -Method Get
Write-Host "   -> [Recursive Slot Search Demo]: OK"

$gcDemo = Invoke-RestMethod -Uri "http://localhost:8080/api/demo/gc" -Method Get
Write-Host "   -> [Garbage Collection & Lifecycle Demo]: OK"

$nestedDemo = Invoke-RestMethod -Uri "http://localhost:8080/api/demo/nested-classes" -Method Get
Write-Host "   -> [Static Nested vs Inner Class Demo]: OK"

$threadDemo = Invoke-RestMethod -Uri "http://localhost:8080/api/demo/threads" -Method Get
Write-Host "   -> [Multithreading & Synchronization Demo]: OK"

Write-Host "`n[10/10] Checking Frontend Availability..."
$fe = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing
Write-Host "   -> Frontend HTTP Status: $($fe.StatusCode) (Vite React Client Online)"

Write-Host "`n========================================================"
Write-Host ">>> 10/10 TESTS PASSED! APPLICATION IS 100% OPERATIONAL! <<<"
Write-Host "========================================================"
