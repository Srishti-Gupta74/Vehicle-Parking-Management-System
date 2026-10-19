-- ============================================================
-- Vehicle Parking Management System - Database Schema (MySQL 8)
-- Database: vehicle_parking_management
-- ============================================================

CREATE DATABASE IF NOT EXISTS vehicle_parking_management;
USE vehicle_parking_management;

-- Drop existing tables in reverse foreign-key order
DROP TABLE IF EXISTS parking_activity_logs;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS parking_sessions;
DROP TABLE IF EXISTS parking_slots;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS users;

-- 1. Users Table (Admin authentication)
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'ADMIN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Vehicles Table
CREATE TABLE vehicles (
    vehicle_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_number VARCHAR(30) NOT NULL UNIQUE,
    owner_name VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(20) NOT NULL, -- 'BIKE', 'CAR', 'TRUCK'
    phone_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Parking Slots Table
CREATE TABLE parking_slots (
    slot_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slot_number VARCHAR(20) NOT NULL UNIQUE,
    slot_type VARCHAR(20) NOT NULL, -- 'BIKE', 'CAR', 'TRUCK'
    floor INT NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' -- 'AVAILABLE', 'OCCUPIED'
);

-- 4. Parking Sessions Table
CREATE TABLE parking_sessions (
    session_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    slot_id BIGINT NOT NULL,
    entry_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    exit_time DATETIME NULL,
    duration BIGINT NULL, -- Duration in hours (or rounded up for billing)
    parking_fee DECIMAL(10, 2) NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'COMPLETED'
    CONSTRAINT fk_session_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE RESTRICT,
    CONSTRAINT fk_session_slot FOREIGN KEY (slot_id) REFERENCES parking_slots(slot_id) ON DELETE RESTRICT
);

-- 5. Payments Table
CREATE TABLE payments (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL, -- 'CASH', 'UPI', 'CARD'
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PAID', -- 'PAID', 'PENDING', 'FAILED'
    payment_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_session FOREIGN KEY (session_id) REFERENCES parking_sessions(session_id) ON DELETE RESTRICT
);

-- 6. Parking Activity Logs Table
CREATE TABLE parking_activity_logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    activity_type VARCHAR(50) NOT NULL, -- 'PARK', 'CHECKOUT', 'SLOT_ADDED', 'PAYMENT'
    description TEXT NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
