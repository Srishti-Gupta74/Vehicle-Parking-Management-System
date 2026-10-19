package com.parking.management.exception;

/**
 * Checked exception thrown when a specific slot cannot be allocated, modified, or deleted.
 */
public class SlotUnavailableException extends Exception {

    public SlotUnavailableException(String message) {
        super(message);
    }

    public SlotUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
