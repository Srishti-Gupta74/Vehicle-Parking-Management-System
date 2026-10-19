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
@Entity
@DiscriminatorValue("TRUCK")
public class Truck extends FourWheeler {

    // Pricing rates for Truck according to specification
    public static final double TRUCK_FIRST_HOUR_RATE = 50.0;
    public static final double TRUCK_ADDITIONAL_HOUR_RATE = 30.0;

    public Truck() {
        super();
    }

    public Truck(String vehicleNumber, String ownerName, String phoneNumber) {
        super(vehicleNumber, ownerName, phoneNumber);
    }

    public Truck(String vehicleNumber, String ownerName, String phoneNumber, int numberOfAxles) {
        super(vehicleNumber, ownerName, phoneNumber, numberOfAxles);
    }

    /**
     * Polymorphic implementation of calculateParkingFee for Truck.
     * Truck: First hour = ₹50, Each additional hour = ₹30.
     */
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

    @Override
    public String displayDetails() {
        return super.displayDetails() + " -> Specific: Heavy Truck (First Hr: ₹50, Extra: ₹30/hr)";
    }
}
