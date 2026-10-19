package com.parking.management.model;

/**
 * Supported vehicle types in the system.
 */
public enum VehicleType {
    BIKE,
    CAR,
    TRUCK;

    public static VehicleType fromString(String type) {
        if (type == null) {
            throw new IllegalArgumentException("Vehicle type cannot be null");
        }
        return VehicleType.valueOf(type.trim().toUpperCase());
    }
}
