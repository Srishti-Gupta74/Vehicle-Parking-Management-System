package com.parking.management.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

/**
 * Concrete subclass representing a Car (Four-Wheeler).
 *
 * Demonstrates:
 * 1. Hierarchical Inheritance (Vehicle -> FourWheeler -> Car)
 * 2. Method Overriding (@Override calculateParkingFee, getVehicleType)
 * 3. Runtime Polymorphism
 * 4. static final constants
 */
@Entity
@DiscriminatorValue("CAR")
public class Car extends FourWheeler {

    // Pricing rates for Car according to specification
    public static final double CAR_FIRST_HOUR_RATE = 30.0;
    public static final double CAR_ADDITIONAL_HOUR_RATE = 20.0;

    public Car() {
        super();
    }

    public Car(String vehicleNumber, String ownerName, String phoneNumber) {
        super(vehicleNumber, ownerName, phoneNumber);
    }

    public Car(String vehicleNumber, String ownerName, String phoneNumber, int numberOfAxles) {
        super(vehicleNumber, ownerName, phoneNumber, numberOfAxles);
    }

    /**
     * Polymorphic implementation of calculateParkingFee for Car.
     * Car: First hour = ₹30, Each additional hour = ₹20.
     */
    @Override
    public double calculateParkingFee(long durationHours) {
        if (durationHours <= 1) {
            return CAR_FIRST_HOUR_RATE;
        }
        return CAR_FIRST_HOUR_RATE + ((durationHours - 1) * CAR_ADDITIONAL_HOUR_RATE);
    }

    @Override
    public String getVehicleType() {
        return "CAR";
    }

    @Override
    public String displayDetails() {
        return super.displayDetails() + " -> Specific: Car (First Hr: ₹30, Extra: ₹20/hr)";
    }
}
