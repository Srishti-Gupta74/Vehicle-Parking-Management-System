package com.parking.management.model;

import jakarta.persistence.*;

/**
 * Entity representing a physical parking slot.
 *
 * Demonstrates:
 * 1. Encapsulation (private fields with domain methods)
 * 2. Constructors (default and parameterized)
 * 3. Type Conversion & Enums
 */
@Entity
@Table(name = "parking_slots")
public class ParkingSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "slot_id")
    private Long slotId;

    @Column(name = "slot_number", nullable = false, unique = true, length = 20)
    private String slotNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "slot_type", nullable = false, length = 20)
    private SlotType slotType;

    @Column(name = "floor", nullable = false)
    private int floor = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private SlotStatus status = SlotStatus.AVAILABLE;

    public ParkingSlot() {
    }

    public ParkingSlot(String slotNumber, SlotType slotType, int floor) {
        this.slotNumber = slotNumber;
        this.slotType = slotType;
        this.floor = floor;
        this.status = SlotStatus.AVAILABLE;
    }

    public ParkingSlot(String slotNumber, SlotType slotType, int floor, SlotStatus status) {
        this.slotNumber = slotNumber;
        this.slotType = slotType;
        this.floor = floor;
        this.status = status;
    }

    public boolean isAvailable() {
        return this.status == SlotStatus.AVAILABLE;
    }

    public void occupy() {
        this.status = SlotStatus.OCCUPIED;
    }

    public void vacate() {
        this.status = SlotStatus.AVAILABLE;
    }

    public boolean isCompatibleWith(VehicleType vehicleType) {
        return this.slotType.name().equalsIgnoreCase(vehicleType.name());
    }

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

    public SlotType getSlotType() {
        return slotType;
    }

    public void setSlotType(SlotType slotType) {
        this.slotType = slotType;
    }

    public int getFloor() {
        return floor;
    }

    public void setFloor(int floor) {
        this.floor = floor;
    }

    public SlotStatus getStatus() {
        return status;
    }

    public void setStatus(SlotStatus status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return String.format("Slot[%s | Floor %d | %s | %s]",
                slotNumber, floor, slotType, status);
    }
}
