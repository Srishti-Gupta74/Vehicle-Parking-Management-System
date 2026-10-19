package com.parking.management.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Transient;

/**
 * Abstract class representing Two-Wheeled vehicles.
 *
 * CSC2104 Syllabus:
 * 1. Multilevel Inheritance (Vehicle -> TwoWheeler -> Bike)
 * 2. super keyword for constructor delegation and method calls
 * 3. Protected / private access modifiers
 */
@Entity
public abstract class TwoWheeler extends Vehicle {

    @Transient
    private int engineCapacityCc;

    /**
     * Default constructor for JPA.
     */
    public TwoWheeler() {
        super();
        this.categoryDescription = "Two-Wheeler Category";
    }

    /**
     * Parameterized constructor calling superclass constructor with super keyword.
     */
    public TwoWheeler(String vehicleNumber, String ownerName, String phoneNumber) {
        super(vehicleNumber, ownerName, phoneNumber);
        this.categoryDescription = "Two-Wheeler Category";
    }

    public TwoWheeler(String vehicleNumber, String ownerName, String phoneNumber, int engineCapacityCc) {
        super(vehicleNumber, ownerName, phoneNumber);
        this.engineCapacityCc = engineCapacityCc;
        this.categoryDescription = "Two-Wheeler Category (" + engineCapacityCc + "cc)";
    }

    public int getEngineCapacityCc() {
        return engineCapacityCc;
    }

    public void setEngineCapacityCc(int engineCapacityCc) {
        this.engineCapacityCc = engineCapacityCc;
    }

    /**
     * Overriding displayDetails and calling super.displayDetails() via super keyword.
     */
    @Override
    public String displayDetails() {
        return super.displayDetails() + " [Class: TwoWheeler]";
    }
}
