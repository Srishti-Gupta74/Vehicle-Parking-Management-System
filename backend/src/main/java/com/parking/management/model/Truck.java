package com.parking.management.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

/**
 * Concrete subclass representing a Truck (Heavy Four-Wheeler / Commercial).
 *
 * Demonstrates:
 * 1. Hierarchical Inheritance (Vehicle -> FourWheeler -> Truck)
 * 2. Method Overriding (@Override calculateParkingFee, getVehicleType)
 * 3. Runtime Polymorphism
 * 4. static final constants
 */
// =========================================================================
// CSC2104 OOP CONCEPT: HIERARCHICAL INHERITANCE & RUNTIME POLYMORPHISM
// Vehicle (Abstract Base) -> FourWheeler (Intermediate) -> Truck (Concrete)
// Demonstrates Method Overriding (@Override) for commercial truck tariff.
// =========================================================================
@Entity
@DiscriminatorValue("TRUCK")
public class Truck extends FourWheeler {

    // === CONCEPT: static final CONSTANTS (Truck specific tariff) ===
    public static final double TRUCK_FIRST_HOUR_RATE = 50.0;
    public static final double TRUCK_ADDITIONAL_HOUR_RATE = 30.0;

    // === CONCEPT: CONSTRUCTOR CHAINING (super() calls FourWheeler constructor) ===
    public Truck() {
        super();
    }

    public Truck(String vehicleNumber, String ownerName, String phoneNumber) {
        super(vehicleNumber, ownerName, phoneNumber);
    }

    public Truck(String vehicleNumber, String ownerName, String phoneNumber, int numberOfAxles) {
        super(vehicleNumber, ownerName, phoneNumber, numberOfAxles);
    }

    // =========================================================================
    // CSC2104 OOP CONCEPT: METHOD OVERRIDING (RUNTIME POLYMORPHISM)
    // Dynamic binding executes this method when Vehicle reference points to Truck
    // =========================================================================
    @Override
    public double calculateParkingFee(long durationHours) {
        if (durationHours <= 1) {
            return TRUCK_FIRST_HOUR_RATE;
        }
        return TRUCK_FIRST_HOUR_RATE + ((durationHours - 1) * TRUCK_ADDITIONAL_HOUR_RATE);
    }

    @Override
    public String getVehicleType() {
        return "TRUCK";
    }

    // === CONCEPT: super KEYWORD (Invokes parent method and extends behavior) ===
    @Override
    public String displayDetails() {
        return super.displayDetails() + " -> Specific: Heavy Truck (First Hr: ₹50, Extra: ₹30/hr)";
    }
}
