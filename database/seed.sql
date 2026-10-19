-- ============================================================
-- Vehicle Parking Management System - Seed Data
-- ============================================================

USE vehicle_parking_management;

-- 1. Insert Default Administrator
INSERT INTO users (name, email, password, role) VALUES
('System Administrator', 'admin@parking.com', 'admin123', 'ADMIN');

-- 2. Insert Parking Slots (20 total across Floor 1 and Floor 2)
-- Floor 1
INSERT INTO parking_slots (slot_number, slot_type, floor, status) VALUES
('B-01', 'BIKE', 1, 'OCCUPIED'),
('B-02', 'BIKE', 1, 'AVAILABLE'),
('B-03', 'BIKE', 1, 'AVAILABLE'),
('B-04', 'BIKE', 1, 'OCCUPIED'),
('C-01', 'CAR', 1, 'OCCUPIED'),
('C-02', 'CAR', 1, 'AVAILABLE'),
('C-03', 'CAR', 1, 'AVAILABLE'),
('C-04', 'CAR', 1, 'AVAILABLE'),
('T-01', 'TRUCK', 1, 'AVAILABLE'),
('T-02', 'TRUCK', 1, 'OCCUPIED');

-- Floor 2
INSERT INTO parking_slots (slot_number, slot_type, floor, status) VALUES
('B-05', 'BIKE', 2, 'AVAILABLE'),
('B-06', 'BIKE', 2, 'AVAILABLE'),
('B-07', 'BIKE', 2, 'AVAILABLE'),
('B-08', 'BIKE', 2, 'AVAILABLE'),
('C-05', 'CAR', 2, 'AVAILABLE'),
('C-06', 'CAR', 2, 'AVAILABLE'),
('C-07', 'CAR', 2, 'AVAILABLE'),
('C-08', 'CAR', 2, 'AVAILABLE'),
('T-03', 'TRUCK', 2, 'AVAILABLE'),
('T-04', 'TRUCK', 2, 'AVAILABLE');

-- 3. Insert Sample Vehicles (10 vehicles: bikes, cars, trucks)
INSERT INTO vehicles (vehicle_number, owner_name, vehicle_type, phone_number, created_at) VALUES
('KA-01-AB-1234', 'Aarav Sharma', 'BIKE', '9876543210', NOW() - INTERVAL 4 HOUR),
('DL-05-XY-5678', 'Priya Patel', 'BIKE', '9812345678', NOW() - INTERVAL 2 HOUR),
('MH-12-PQ-9012', 'Rohan Verma', 'BIKE', '9765432109', NOW() - INTERVAL 8 HOUR),
('KA-05-MJ-4321', 'Ananya Iyer', 'CAR', '9845012345', NOW() - INTERVAL 3 HOUR),
('DL-01-CA-7788', 'Vikram Singh', 'CAR', '9823456781', NOW() - INTERVAL 10 HOUR),
('MH-02-CD-3344', 'Neha Gupta', 'CAR', '9934567892', NOW() - INTERVAL 12 HOUR),
('HR-26-EE-9900', 'Siddharth Rao', 'CAR', '9911223344', NOW() - INTERVAL 15 HOUR),
('KA-04-TR-1122', 'Gurdeep Logistics', 'TRUCK', '9888776655', NOW() - INTERVAL 5 HOUR),
('UP-32-TK-5566', 'Balaji Freight', 'TRUCK', '9777665544', NOW() - INTERVAL 14 HOUR),
('RJ-14-HT-8899', 'National Movers', 'TRUCK', '9666554433', NOW() - INTERVAL 20 HOUR);

-- 4. Insert Parking Sessions
-- 4.1 Completed Sessions
-- Session 1: Bike MH-12-PQ-9012 (Vehicle 3), Slot B-02 (Slot 2), Duration 3 hrs, Fee = 20 + 2*10 = 40
INSERT INTO parking_sessions (session_id, vehicle_id, slot_id, entry_time, exit_time, duration, parking_fee, status) VALUES
(1, 3, 2, NOW() - INTERVAL 8 HOUR, NOW() - INTERVAL 5 HOUR, 3, 40.00, 'COMPLETED');

-- Session 2: Car DL-01-CA-7788 (Vehicle 5), Slot C-02 (Slot 6), Duration 4 hrs, Fee = 30 + 3*20 = 90
INSERT INTO parking_sessions (session_id, vehicle_id, slot_id, entry_time, exit_time, duration, parking_fee, status) VALUES
(2, 5, 6, NOW() - INTERVAL 10 HOUR, NOW() - INTERVAL 6 HOUR, 4, 90.00, 'COMPLETED');

-- Session 3: Car MH-02-CD-3344 (Vehicle 6), Slot C-03 (Slot 7), Duration 2 hrs, Fee = 30 + 1*20 = 50
INSERT INTO parking_sessions (session_id, vehicle_id, slot_id, entry_time, exit_time, duration, parking_fee, status) VALUES
(3, 6, 7, NOW() - INTERVAL 12 HOUR, NOW() - INTERVAL 10 HOUR, 2, 50.00, 'COMPLETED');

-- Session 4: Truck UP-32-TK-5566 (Vehicle 9), Slot T-01 (Slot 9), Duration 5 hrs, Fee = 50 + 4*30 = 170
INSERT INTO parking_sessions (session_id, vehicle_id, slot_id, entry_time, exit_time, duration, parking_fee, status) VALUES
(4, 9, 9, NOW() - INTERVAL 14 HOUR, NOW() - INTERVAL 9 HOUR, 5, 170.00, 'COMPLETED');

-- Session 5: Car HR-26-EE-9900 (Vehicle 7), Slot C-04 (Slot 8), Duration 1 hr, Fee = 30.00
INSERT INTO parking_sessions (session_id, vehicle_id, slot_id, entry_time, exit_time, duration, parking_fee, status) VALUES
(5, 7, 8, NOW() - INTERVAL 15 HOUR, NOW() - INTERVAL 14 HOUR, 1, 30.00, 'COMPLETED');

-- Session 6: Truck RJ-14-HT-8899 (Vehicle 10), Slot T-03 (Slot 19), Duration 6 hrs, Fee = 50 + 5*30 = 200
INSERT INTO parking_sessions (session_id, vehicle_id, slot_id, entry_time, exit_time, duration, parking_fee, status) VALUES
(6, 10, 19, NOW() - INTERVAL 20 HOUR, NOW() - INTERVAL 14 HOUR, 6, 200.00, 'COMPLETED');

-- 4.2 Active Sessions
-- Session 7: Bike KA-01-AB-1234 (Vehicle 1) parked in B-01 (Slot 1), entered 4 hours ago
INSERT INTO parking_sessions (session_id, vehicle_id, slot_id, entry_time, exit_time, duration, parking_fee, status) VALUES
(7, 1, 1, NOW() - INTERVAL 4 HOUR, NULL, NULL, NULL, 'ACTIVE');

-- Session 8: Bike DL-05-XY-5678 (Vehicle 2) parked in B-04 (Slot 4), entered 2 hours ago
INSERT INTO parking_sessions (session_id, vehicle_id, slot_id, entry_time, exit_time, duration, parking_fee, status) VALUES
(8, 2, 4, NOW() - INTERVAL 2 HOUR, NULL, NULL, NULL, 'ACTIVE');

-- Session 9: Car KA-05-MJ-4321 (Vehicle 4) parked in C-01 (Slot 5), entered 3 hours ago
INSERT INTO parking_sessions (session_id, vehicle_id, slot_id, entry_time, exit_time, duration, parking_fee, status) VALUES
(9, 4, 5, NOW() - INTERVAL 3 HOUR, NULL, NULL, NULL, 'ACTIVE');

-- Session 10: Truck KA-04-TR-1122 (Vehicle 8) parked in T-02 (Slot 10), entered 5 hours ago
INSERT INTO parking_sessions (session_id, vehicle_id, slot_id, entry_time, exit_time, duration, parking_fee, status) VALUES
(10, 8, 10, NOW() - INTERVAL 5 HOUR, NULL, NULL, NULL, 'ACTIVE');

-- 5. Insert Payments for completed sessions
INSERT INTO payments (session_id, amount, payment_method, payment_status, payment_time) VALUES
(1, 40.00, 'UPI', 'PAID', NOW() - INTERVAL 5 HOUR),
(2, 90.00, 'CARD', 'PAID', NOW() - INTERVAL 6 HOUR),
(3, 50.00, 'CASH', 'PAID', NOW() - INTERVAL 10 HOUR),
(4, 170.00, 'UPI', 'PAID', NOW() - INTERVAL 9 HOUR),
(5, 30.00, 'CASH', 'PAID', NOW() - INTERVAL 14 HOUR),
(6, 200.00, 'CARD', 'PAID', NOW() - INTERVAL 14 HOUR);

-- 6. Insert Activity Logs
INSERT INTO parking_activity_logs (activity_type, description, timestamp) VALUES
('SYSTEM', 'System initialized with 20 parking slots across 2 floors.', NOW() - INTERVAL 24 HOUR),
('PARK', 'Vehicle KA-01-AB-1234 (BIKE) parked at slot B-01.', NOW() - INTERVAL 4 HOUR),
('PARK', 'Vehicle DL-05-XY-5678 (BIKE) parked at slot B-04.', NOW() - INTERVAL 2 HOUR),
('PARK', 'Vehicle KA-05-MJ-4321 (CAR) parked at slot C-01.', NOW() - INTERVAL 3 HOUR),
('PARK', 'Vehicle KA-04-TR-1122 (TRUCK) parked at slot T-02.', NOW() - INTERVAL 5 HOUR),
('CHECKOUT', 'Vehicle MH-12-PQ-9012 (BIKE) checked out from slot B-02. Fee: ₹40.00 paid via UPI.', NOW() - INTERVAL 5 HOUR),
('CHECKOUT', 'Vehicle DL-01-CA-7788 (CAR) checked out from slot C-02. Fee: ₹90.00 paid via CARD.', NOW() - INTERVAL 6 HOUR);
