package com.parking.management.exception;

/**
 * Unchecked exception thrown when vehicle data fails domain validation.
 */
public class InvalidVehicleException extends RuntimeException {

    public InvalidVehicleException(String message) {
        super(message);
    }

    public InvalidVehicleException(String message, Throwable cause) {
        super(message, cause);
    }
}
