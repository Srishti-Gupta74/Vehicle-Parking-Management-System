package com.parking.management.model;

import jakarta.persistence.*;
import java.time.Duration;
import java.time.LocalDateTime;

/**
 * Entity representing an active or completed Parking Session.
 *
 * Demonstrates:
 * 1. Composition (ParkingSession HAS-A Vehicle, ParkingSession HAS-A ParkingSlot)
 * 2. Type Conversion (Implicit and Explicit casting during duration calculation)
 * 3. Encapsulation and Domain Logic
 */
@Entity
@Table(name = "parking_sessions")
public class ParkingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Long sessionId;

    // Composition: HAS-A Vehicle
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    // Composition: HAS-A ParkingSlot
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "slot_id", nullable = false)
    private ParkingSlot slot;

    @Column(name = "entry_time", nullable = false)
    private LocalDateTime entryTime;

    @Column(name = "exit_time")
    private LocalDateTime exitTime;

    @Column(name = "duration")
    private Long duration; // In whole hours rounded up for billing

    @Column(name = "parking_fee")
    private Double parkingFee;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private SessionStatus status = SessionStatus.ACTIVE;

    public ParkingSession() {
        this.entryTime = LocalDateTime.now();
        this.status = SessionStatus.ACTIVE;
    }

    public ParkingSession(Vehicle vehicle, ParkingSlot slot) {
        this.vehicle = vehicle;
        this.slot = slot;
        this.entryTime = LocalDateTime.now();
        this.status = SessionStatus.ACTIVE;
    }

    public ParkingSession(Vehicle vehicle, ParkingSlot slot, LocalDateTime entryTime) {
        this.vehicle = vehicle;
        this.slot = slot;
        this.entryTime = entryTime;
        this.status = SessionStatus.ACTIVE;
    }

    /**
     * Calculates the duration in hours rounded up to the nearest whole hour.
     * Demonstrates explicit casting: (long) Math.ceil(...)
     * and implicit conversion: minutes (long) converted to double inside division.
     *
     * @param currentTime reference time for duration calculation
     * @return hours as long
     */
    public long calculateDurationHours(LocalDateTime currentTime) {
        if (entryTime == null || currentTime == null) {
            return 1L;
        }
        long minutes = Duration.between(entryTime, currentTime).toMinutes();
        if (minutes <= 60) {
            return 1L;
        }
        // Explicit casting demonstration:
        double hoursFraction = (double) minutes / 60.0;
        long roundedHours = (long) Math.ceil(hoursFraction);
        return Math.max(1L, roundedHours);
    }

    /**
     * Completes the parking session, records exit time, duration, and fee.
     */
    public void complete(LocalDateTime exitTime, double fee) {
        this.exitTime = (exitTime != null) ? exitTime : LocalDateTime.now();
        this.duration = calculateDurationHours(this.exitTime);
        this.parkingFee = fee;
        this.status = SessionStatus.COMPLETED;
    }

    public boolean isActive() {
        return this.status == SessionStatus.ACTIVE;
    }

    // ==========================================
    // GETTERS AND SETTERS
    // ==========================================

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public ParkingSlot getSlot() {
        return slot;
    }

    public void setSlot(ParkingSlot slot) {
        this.slot = slot;
    }

    public LocalDateTime getEntryTime() {
        return entryTime;
    }

    public void setEntryTime(LocalDateTime entryTime) {
        this.entryTime = entryTime;
    }

    public LocalDateTime getExitTime() {
        return exitTime;
    }

    public void setExitTime(LocalDateTime exitTime) {
        this.exitTime = exitTime;
    }

    public Long getDuration() {
        return duration;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
    }

    public Double getParkingFee() {
        return parkingFee;
    }

    public void setParkingFee(Double parkingFee) {
        this.parkingFee = parkingFee;
    }

    public SessionStatus getStatus() {
        return status;
    }

    public void setStatus(SessionStatus status) {
        this.status = status;
    }
}
