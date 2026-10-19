package com.parking.management.model;

import com.parking.management.interfaces.ParkingFeeCalculator;
import com.parking.management.interfaces.PrintableReceipt;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Abstract base class representing a Vehicle in the parking management system.
 *
 * Demonstrates the following CSC2104 OOP Syllabus Concepts:
 * 1. Abstraction (abstract class cannot be instantiated directly, defines abstract methods)
 * 2. Encapsulation (private fields with controlled getter/setter access)
 * 3. Inheritance (Base of Vehicle -> TwoWheeler/FourWheeler -> Bike/Car/Truck hierarchy)
 * 4. Method Overloading (multiple calculateParkingFee method signatures)
 * 5. Interface Implementation (implements ParkingFeeCalculator, PrintableReceipt)
 * 6. Constructors (default and parameterized constructors)
 * 7. final keyword (constant definitions)
 * 8. Autoboxing / Unboxing and Type Conversion
 */
@Entity
@Table(name = "vehicles")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "vehicle_type", discriminatorType = DiscriminatorType.STRING)
public abstract class Vehicle implements ParkingFeeCalculator, PrintableReceipt {

    // Final constant demonstrating the final keyword
    public static final double MINIMUM_BILLING_HOURS = 1.0;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vehicle_id")
    private Long vehicleId;

    @Column(name = "vehicle_number", nullable = false, unique = true, length = 30)
    private String vehicleNumber;

    @Column(name = "owner_name", nullable = false, length = 100)
    private String ownerName;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Transient field for sub-classification / display if needed
    @Transient
    protected String categoryDescription;

    /**
     * Default constructor (Required by JPA specification).
     */
    public Vehicle() {
        this.createdAt = LocalDateTime.now();
    }

    /**
     * Parameterized constructor demonstrating constructor initialization.
     *
     * @param vehicleNumber registration license plate
     * @param ownerName name of vehicle owner
     * @param phoneNumber contact number
     */
    public Vehicle(String vehicleNumber, String ownerName, String phoneNumber) {
        this();
        // Validation demonstrating defensive programming
        setVehicleNumber(vehicleNumber);
        setOwnerName(ownerName);
        setPhoneNumber(phoneNumber);
    }

    // ==========================================
    // ABSTRACT METHODS (Must be overridden by subclasses)
    // ==========================================

    /**
     * Abstract method for calculating parking fee according to vehicle type.
     * Subclasses (Bike, Car, Truck) provide polymorphic implementations.
     */
    @Override
    public abstract double calculateParkingFee(long durationHours);

    /**
     * Abstract method returning the concrete vehicle type as a string.
     */
    public abstract String getVehicleType();

    // ==========================================
    // METHOD OVERLOADING (CSC2104 Syllabus)
    // ==========================================

    /**
     * Overloaded method 1: Accepts duration with a promotional discount percentage.
     */
    @Override
    public double calculateParkingFee(long durationHours, double discountPercentage) {
        double standardFee = calculateParkingFee(durationHours);
        if (discountPercentage <= 0.0) {
            return standardFee;
        }
        // Explicit type casting demonstration: (double)
        double discountAmount = standardFee * (discountPercentage / 100.0);
        double finalFee = standardFee - discountAmount;
        return Math.max(0.0, Math.round(finalFee * 100.0) / 100.0);
    }

    /**
     * Overloaded method 2: Accepts integer duration (demonstrates implicit type widening
     * from int to long, and autoboxing with Integer wrapper).
     */
    public double calculateParkingFee(Integer hoursWrapper) {
        if (hoursWrapper == null) {
            return 0.0;
        }
        // Unboxing Integer to primitive int, then widening conversion to long
        int primitiveHours = hoursWrapper;
        long durationLong = (long) primitiveHours;
        return calculateParkingFee(durationLong);
    }

    // ==========================================
    // PRINTABLE RECEIPT IMPLEMENTATION
    // ==========================================

    @Override
    public String formatReceiptDetails(String slotNumber, long durationHours, double fee, String paymentMethod) {
        StringBuilder sb = new StringBuilder();
        sb.append("========================================\n");
        sb.append("      VPMS PARKING RECEIPT             \n");
        sb.append("========================================\n");
        sb.append("Vehicle Number : ").append(this.vehicleNumber).append("\n");
        sb.append("Vehicle Type   : ").append(getVehicleType()).append("\n");
        sb.append("Owner Name     : ").append(this.ownerName).append("\n");
        sb.append("Slot Number    : ").append(slotNumber).append("\n");
        sb.append("Duration (Hrs) : ").append(durationHours).append("\n");
        sb.append("Total Fee (₹)  : ").append(String.format("%.2f", fee)).append("\n");
        sb.append("Payment Mode   : ").append(paymentMethod).append("\n");
        sb.append("Generated At   : ").append(LocalDateTime.now()).append("\n");
        sb.append(getReceiptFooter()).append("\n");
        return sb.toString();
    }

    /**
     * Displays summary details of this vehicle. Subclasses override and extend this.
     */
    public String displayDetails() {
        return String.format("[%s] No: %s | Owner: %s | Phone: %s",
                getVehicleType(), vehicleNumber, ownerName, phoneNumber);
    }

    // ==========================================
    // ENCAPSULATION: GETTERS AND SETTERS WITH VALIDATION
    // ==========================================

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        if (vehicleNumber == null || vehicleNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Vehicle number cannot be null or empty");
        }
        this.vehicleNumber = vehicleNumber.trim().toUpperCase();
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        if (ownerName == null || ownerName.trim().isEmpty()) {
            throw new IllegalArgumentException("Owner name cannot be null or empty");
        }
        this.ownerName = ownerName.trim();
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be null or empty");
        }
        this.phoneNumber = phoneNumber.trim();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return displayDetails();
    }
}
