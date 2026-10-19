package com.parking.management.exception;

/**
 * Unchecked exception thrown when a queried vehicle is not found in the database.
 *
 * CSC2104 Syllabus:
 * 1. Unchecked Exceptions (subclass of java.lang.RuntimeException)
 */
public class VehicleNotFoundException extends RuntimeException {

    public VehicleNotFoundException(String message) {
        super(message);
    }

    public VehicleNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
