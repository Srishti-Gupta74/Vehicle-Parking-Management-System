package com.parking.management.interfaces;

/**
 * Interface demonstrating Java Interfaces and polymorphic receipt formatting.
 * CSC2104 Syllabus: Interface declaration, Default methods, Abstract methods.
 */
public interface PrintableReceipt {

    /**
     * Formats receipt details into a structured textual format.
     */
    String formatReceiptDetails(String slotNumber, long durationHours, double fee, String paymentMethod);

    /**
     * Default method in interface (Java 8+ concept in OOP syllabus).
     * Provides a standard receipt footer across all implementers.
     */
    default String getReceiptFooter() {
        return "========================================\n" +
               "  Thank you for using VPMS Parking!     \n" +
               "      Drive Safely & Have a Nice Day    \n" +
               "========================================";
    }
}
