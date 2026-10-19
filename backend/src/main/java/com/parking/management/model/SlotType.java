package com.parking.management.model;

public enum SlotType {
    BIKE,
    CAR,
    TRUCK;

    public static SlotType fromString(String type) {
        if (type == null) {
            throw new IllegalArgumentException("Slot type cannot be null");
        }
        return SlotType.valueOf(type.trim().toUpperCase());
    }

    public boolean isCompatibleWith(VehicleType vehicleType) {
        return this.name().equals(vehicleType.name());
    }
}
