package com.parking.management.model;

import java.time.LocalDateTime;

/**
 * Value object representing a finalized checkout receipt.
 */
public class ParkingReceipt {

    private String receiptNumber;
    private Long sessionId;
    private String vehicleNumber;
    private String vehicleType;
    private String ownerName;
    private String slotNumber;
    private int floor;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private long durationHours;
    private double parkingFee;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime paymentTime;

    public ParkingReceipt() {
    }

    public ParkingReceipt(Long sessionId, Vehicle vehicle, ParkingSlot slot,
                          LocalDateTime entryTime, LocalDateTime exitTime,
                          long durationHours, double parkingFee,
                          String paymentMethod, String paymentStatus) {
        this.sessionId = sessionId;
        this.receiptNumber = "REC-" + sessionId + "-" + (System.currentTimeMillis() % 10000);
        this.vehicleNumber = vehicle.getVehicleNumber();
        this.vehicleType = vehicle.getVehicleType();
        this.ownerName = vehicle.getOwnerName();
        this.slotNumber = slot.getSlotNumber();
        this.floor = slot.getFloor();
        this.entryTime = entryTime;
        this.exitTime = exitTime;
        this.durationHours = durationHours;
        this.parkingFee = parkingFee;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.paymentTime = LocalDateTime.now();
    }

    public String getReceiptNumber() {
        return receiptNumber;
    }

    public void setReceiptNumber(String receiptNumber) {
        this.receiptNumber = receiptNumber;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getSlotNumber() {
        return slotNumber;
    }

    public void setSlotNumber(String slotNumber) {
        this.slotNumber = slotNumber;
    }

    public int getFloor() {
        return floor;
    }

    public void setFloor(int floor) {
        this.floor = floor;
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

    public long getDurationHours() {
        return durationHours;
    }

    public void setDurationHours(long durationHours) {
        this.durationHours = durationHours;
    }

    public String getFormattedDuration() {
        if (entryTime == null || exitTime == null) {
            return durationHours + " hr(s)";
        }
        long totalMins = Math.max(1L, java.time.Duration.between(entryTime, exitTime).toMinutes());
        if (totalMins < 60) {
            return totalMins + " min" + (totalMins == 1 ? "" : "s");
        }
        long hrs = totalMins / 60;
        long mins = totalMins % 60;
        if (mins == 0) {
            return hrs + " hr" + (hrs == 1 ? "" : "s");
        }
        return hrs + " hr " + mins + " min" + (mins == 1 ? "" : "s");
    }

    public double getParkingFee() {
        return parkingFee;
    }

    public void setParkingFee(double parkingFee) {
        this.parkingFee = parkingFee;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getPaymentTime() {
        return paymentTime;
    }

    public void setPaymentTime(LocalDateTime paymentTime) {
        this.paymentTime = paymentTime;
    }
}
