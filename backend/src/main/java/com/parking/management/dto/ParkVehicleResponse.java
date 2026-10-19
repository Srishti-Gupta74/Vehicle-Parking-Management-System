package com.parking.management.dto;

import java.time.LocalDateTime;

public class ParkVehicleResponse {

    private Long sessionId;
    private String ticketNumber;
    private String vehicleNumber;
    private String vehicleType;
    private String ownerName;
    private String slotNumber;
    private int floor;
    private LocalDateTime entryTime;
    private String message;

    public ParkVehicleResponse() {}

    public ParkVehicleResponse(Long sessionId, String ticketNumber, String vehicleNumber,
                               String vehicleType, String ownerName, String slotNumber,
                               int floor, LocalDateTime entryTime, String message) {
        this.sessionId = sessionId;
        this.ticketNumber = ticketNumber;
        this.vehicleNumber = vehicleNumber;
        this.vehicleType = vehicleType;
        this.ownerName = ownerName;
        this.slotNumber = slotNumber;
        this.floor = floor;
        this.entryTime = entryTime;
        this.message = message;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public void setTicketNumber(String ticketNumber) {
        this.ticketNumber = ticketNumber;
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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
