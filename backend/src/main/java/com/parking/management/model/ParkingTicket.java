package com.parking.management.model;

import java.time.LocalDateTime;

/**
 * Value object representing an entry parking ticket issued to the driver.
 */
public class ParkingTicket {

    private String ticketNumber;
    private Long sessionId;
    private String vehicleNumber;
    private String vehicleType;
    private String ownerName;
    private String phoneNumber;
    private String slotNumber;
    private int floor;
    private LocalDateTime entryTime;

    public ParkingTicket() {
    }

    public ParkingTicket(Long sessionId, Vehicle vehicle, ParkingSlot slot, LocalDateTime entryTime) {
        this.sessionId = sessionId;
        this.ticketNumber = "TCK-" + sessionId + "-" + System.currentTimeMillis() % 10000;
        this.vehicleNumber = vehicle.getVehicleNumber();
        this.vehicleType = vehicle.getVehicleType();
        this.ownerName = vehicle.getOwnerName();
        this.phoneNumber = vehicle.getPhoneNumber();
        this.slotNumber = slot.getSlotNumber();
        this.floor = slot.getFloor();
        this.entryTime = entryTime;
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public void setTicketNumber(String ticketNumber) {
        this.ticketNumber = ticketNumber;
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

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
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
}
