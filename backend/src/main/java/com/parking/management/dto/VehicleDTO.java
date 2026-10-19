package com.parking.management.dto;

import java.time.LocalDateTime;

public class VehicleDTO {

    private Long vehicleId;
    private String vehicleNumber;
    private String ownerName;
    private String vehicleType;
    private String phoneNumber;
    private LocalDateTime createdAt;
    private boolean currentlyParked;
    private String currentSlotNumber;
    private Long currentSessionId;
    private LocalDateTime currentEntryTime;
    private Long currentDurationHours;
    private Double currentEstimatedFee;

    public VehicleDTO() {}

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isCurrentlyParked() {
        return currentlyParked;
    }

    public void setCurrentlyParked(boolean currentlyParked) {
        this.currentlyParked = currentlyParked;
    }

    public String getCurrentSlotNumber() {
        return currentSlotNumber;
    }

    public void setCurrentSlotNumber(String currentSlotNumber) {
        this.currentSlotNumber = currentSlotNumber;
    }

    public Long getCurrentSessionId() {
        return currentSessionId;
    }

    public void setCurrentSessionId(Long currentSessionId) {
        this.currentSessionId = currentSessionId;
    }

    public LocalDateTime getCurrentEntryTime() {
        return currentEntryTime;
    }

    public void setCurrentEntryTime(LocalDateTime currentEntryTime) {
        this.currentEntryTime = currentEntryTime;
    }

    public Long getCurrentDurationHours() {
        return currentDurationHours;
    }

    public void setCurrentDurationHours(Long currentDurationHours) {
        this.currentDurationHours = currentDurationHours;
    }

    public Double getCurrentEstimatedFee() {
        return currentEstimatedFee;
    }

    public void setCurrentEstimatedFee(Double currentEstimatedFee) {
        this.currentEstimatedFee = currentEstimatedFee;
    }
}
