package com.parking.management.interfaces;

/**
 * Interface demonstrating Java Abstraction and Contract Definition.
 * CSC2104 Syllabus: Interfaces, Method Overloading.
 */
public interface ParkingFeeCalculator {

    /**
     * Calculates the parking fee based on duration in hours.
     * Runtime polymorphism ensures subclasses (Bike, Car, Truck) provide their own implementation.
     *
     * @param durationHours the total duration rounded up to nearest whole hour
     * @return the calculated fee in Rupees (₹)
     */
    double calculateParkingFee(long durationHours);

    /**
     * Overloaded method supporting a discount percentage.
     * Demonstrates Method Overloading within an interface contract.
     *
     * @param durationHours duration in hours
     * @param discountPercentage discount rate (0.0 to 100.0)
     * @return discounted fee
     */
    double calculateParkingFee(long durationHours, double discountPercentage);
}
