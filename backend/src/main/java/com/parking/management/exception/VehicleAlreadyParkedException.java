package com.parking.management.exception;

/**
 * Unchecked exception thrown when a vehicle already has an active parking session.
 */
public class VehicleAlreadyParkedException extends RuntimeException {

    public VehicleAlreadyParkedException(String message) {
        super(message);
    }

    public VehicleAlreadyParkedException(String message, Throwable cause) {
        super(message, cause);
    }
}
