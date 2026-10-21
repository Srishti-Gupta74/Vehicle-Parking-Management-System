package com.parking.management.interfaces;

/**
 * Interface demonstrating Java Abstraction and Contract Definition.
 * CSC2104 Syllabus: Interfaces, Method Overloading.
 */
// =========================================================================
// CSC2104 OOP CONCEPT: INTERFACE CONTRACT DEFINITION & METHOD OVERLOADING
// 1. Pure Abstraction: Specifies behaviors without providing method bodies.
// 2. Method Overloading: calculateParkingFee(long) and calculateParkingFee(long, double).
// =========================================================================
public interface ParkingFeeCalculator {

    // === CONCEPT: ABSTRACT METHOD IN INTERFACE (To be implemented by Vehicle subclasses) ===
    double calculateParkingFee(long durationHours);

    // === CONCEPT: METHOD OVERLOADING IN INTERFACE (Same name, different parameters) ===
    double calculateParkingFee(long durationHours, double discountPercentage);
}
