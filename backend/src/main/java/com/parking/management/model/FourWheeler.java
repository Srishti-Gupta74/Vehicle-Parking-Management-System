package com.parking.management.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Transient;

/**
 * Abstract class representing Four-Wheeled (or higher) vehicles.
 *
 * CSC2104 Syllabus:
 * 1. Hierarchical Inheritance (Vehicle -> FourWheeler -> Car, Truck)
 * 2. super keyword
 * 3. Encapsulation
 */
@Entity
public abstract class FourWheeler extends Vehicle {

    @Transient
    private int numberOfAxles = 2;

    public FourWheeler() {
        super();
        this.categoryDescription = "Four-Wheeler Category";
    }

    public FourWheeler(String vehicleNumber, String ownerName, String phoneNumber) {
        super(vehicleNumber, ownerName, phoneNumber);
        this.categoryDescription = "Four-Wheeler Category";
    }

    public FourWheeler(String vehicleNumber, String ownerName, String phoneNumber, int numberOfAxles) {
        super(vehicleNumber, ownerName, phoneNumber);
        this.numberOfAxles = numberOfAxles;
        this.categoryDescription = "Four-Wheeler Category (" + numberOfAxles + " axles)";
    }

    public int getNumberOfAxles() {
        return numberOfAxles;
    }

    public void setNumberOfAxles(int numberOfAxles) {
        this.numberOfAxles = numberOfAxles;
    }

    @Override
    public String displayDetails() {
        return super.displayDetails() + " [Class: FourWheeler]";
    }
}
