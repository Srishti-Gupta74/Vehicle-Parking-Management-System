package com.parking.management.exception;

/**
 * Checked exception thrown when no compatible parking slot is available.
 *
 * CSC2104 Syllabus:
 * 1. Checked Exceptions (subclass of java.lang.Exception)
 * 2. throws clause in method signatures
 * 3. try/catch/finally enforcement by compiler
 */
public class ParkingLotFullException extends Exception {

    public ParkingLotFullException(String message) {
        super(message);
    }

    public ParkingLotFullException(String message, Throwable cause) {
        super(message, cause);
    }
}
