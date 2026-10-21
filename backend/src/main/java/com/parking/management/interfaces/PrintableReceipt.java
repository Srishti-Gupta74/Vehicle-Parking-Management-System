package com.parking.management.interfaces;

/**
 * Interface demonstrating Java Interfaces and polymorphic receipt formatting.
 * CSC2104 Syllabus: Interface declaration, Default methods, Abstract methods.
 */
// =========================================================================
// CSC2104 OOP CONCEPT: INTERFACE & DEFAULT METHODS (Java 8+)
// 1. Multiple Interface Implementation (Vehicle implements PrintableReceipt & ParkingFeeCalculator).
// 2. default method: Provides a default body so implementing classes don't have to redefine it.
// =========================================================================
public interface PrintableReceipt {

    // === CONCEPT: ABSTRACT METHOD IN INTERFACE ===
    String formatReceiptDetails(String slotNumber, long durationHours, double fee, String paymentMethod);

    // === CONCEPT: DEFAULT METHOD IN INTERFACE (Provides fallback implementation) ===
    default String getReceiptFooter() {
        return "========================================\n" +
               "  Thank you for using VPMS Parking!     \n" +
               "      Drive Safely & Have a Nice Day    \n" +
               "========================================";
    }
}
