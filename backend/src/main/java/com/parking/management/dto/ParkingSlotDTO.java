package com.parking.management.dto;

import java.time.LocalDateTime;

public class ParkingSlotDTO {

    private Long slotId;
    private String slotNumber;
    private String slotType;
    private int floor;
    private String status;
    private String currentVehicleNumber;
    private String currentOwnerName;
    private String currentVehicleType;
    private LocalDateTime currentEntryTime;
    private Long currentDurationHours;
    private String currentDurationFormatted;
    private Double currentEstimatedFee;

    public ParkingSlotDTO() {}

    public Long getSlotId() {
        return slotId;
    }

    public void setSlotId(Long slotId) {
        this.slotId = slotId;
    }

    public String getSlotNumber() {
        return slotNumber;
    }

    public void setSlotNumber(String slotNumber) {
        this.slotNumber = slotNumber;
    }

    public String getSlotType() {
        return slotType;
    }

    public void setSlotType(String slotType) {
        this.slotType = slotType;
    }

    public int getFloor() {
        return floor;
    }

    public void setFloor(int floor) {
        this.floor = floor;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCurrentVehicleNumber() {
        return currentVehicleNumber;
    }

    public void setCurrentVehicleNumber(String currentVehicleNumber) {
        this.currentVehicleNumber = currentVehicleNumber;
    }

    public String getCurrentOwnerName() {
        return currentOwnerName;
    }

    public void setCurrentOwnerName(String currentOwnerName) {
        this.currentOwnerName = currentOwnerName;
    }

    public String getCurrentVehicleType() {
        return currentVehicleType;
    }

    public void setCurrentVehicleType(String currentVehicleType) {
        this.currentVehicleType = currentVehicleType;
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

    public String getCurrentDurationFormatted() {
        return currentDurationFormatted;
    }

    public void setCurrentDurationFormatted(String currentDurationFormatted) {
        this.currentDurationFormatted = currentDurationFormatted;
    }

    public Double getCurrentEstimatedFee() {
        return currentEstimatedFee;
    }

    public void setCurrentEstimatedFee(Double currentEstimatedFee) {
        this.currentEstimatedFee = currentEstimatedFee;
    }
}
