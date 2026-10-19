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
@Entity
@DiscriminatorValue("BIKE")
public class Bike extends TwoWheeler {

    // Pricing rates for Bike according to specification
    public static final double BIKE_FIRST_HOUR_RATE = 20.0;
    public static final double BIKE_ADDITIONAL_HOUR_RATE = 10.0;

    public Bike() {
        super();
    }

    public Bike(String vehicleNumber, String ownerName, String phoneNumber) {
        super(vehicleNumber, ownerName, phoneNumber);
    }

    public Bike(String vehicleNumber, String ownerName, String phoneNumber, int engineCapacityCc) {
        super(vehicleNumber, ownerName, phoneNumber, engineCapacityCc);
    }

    /**
     * Polymorphic implementation of calculateParkingFee for Bike.
     * Bike: First hour = ₹20, Each additional hour = ₹10.
     */
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

    @Override
    public String displayDetails() {
        return super.displayDetails() + " -> Specific: Bike (First Hr: ₹20, Extra: ₹10/hr)";
    }
}
