package com.parking.management.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

/**
 * Concrete subclass representing a Bike (Two-Wheeler).
 *
 * Demonstrates:
 * 1. Multilevel Inheritance (Vehicle -> TwoWheeler -> Bike)
 * 2. Method Overriding (@Override calculateParkingFee, getVehicleType)
 * 3. Runtime Polymorphism (when referenced as Vehicle vehicle = new Bike(...))
 * 4. static final constants
 */
// =========================================================================
// CSC2104 OOP CONCEPT: MULTILEVEL INHERITANCE & RUNTIME POLYMORPHISM
// Vehicle (Level 1) -> TwoWheeler (Level 2) -> Bike (Level 3)
// Demonstrates Method Overriding (@Override) for Bike-specific fee rate.
// =========================================================================
@Entity
@DiscriminatorValue("BIKE")
public class Bike extends TwoWheeler {

    // === CONCEPT: static final CONSTANTS (Bike specific tariff) ===
    public static final double BIKE_FIRST_HOUR_RATE = 20.0;
    public static final double BIKE_ADDITIONAL_HOUR_RATE = 10.0;

    // === CONCEPT: CONSTRUCTOR CHAINING (super() calls TwoWheeler constructor) ===
    public Bike() {
        super();
    }

    public Bike(String vehicleNumber, String ownerName, String phoneNumber) {
        super(vehicleNumber, ownerName, phoneNumber);
    }

    public Bike(String vehicleNumber, String ownerName, String phoneNumber, int engineCapacityCc) {
        super(vehicleNumber, ownerName, phoneNumber, engineCapacityCc);
    }

    // =========================================================================
    // CSC2104 OOP CONCEPT: METHOD OVERRIDING (RUNTIME POLYMORPHISM)
    // Dynamic binding executes this method when Vehicle reference points to Bike
    // =========================================================================
    @Override
    public double calculateParkingFee(long durationHours) {
        if (durationHours <= 1) {
            return BIKE_FIRST_HOUR_RATE;
        }
        // Implicit type conversion (long durationHours - 1) * double rate => double
        return BIKE_FIRST_HOUR_RATE + ((durationHours - 1) * BIKE_ADDITIONAL_HOUR_RATE);
    }

    @Override
    public String getVehicleType() {
        return "BIKE";
    }

    // === CONCEPT: super KEYWORD (Invokes parent method and extends behavior) ===
    @Override
    public String displayDetails() {
        return super.displayDetails() + " -> Specific: Bike (First Hr: ₹20, Extra: ₹10/hr)";
    }
}
