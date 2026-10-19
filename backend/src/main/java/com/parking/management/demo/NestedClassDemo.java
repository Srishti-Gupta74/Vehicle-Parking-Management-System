package com.parking.management.demo;

import com.parking.management.model.ParkingLot;
import com.parking.management.model.ParkingSlot;
import com.parking.management.model.SlotStatus;
import com.parking.management.model.SlotType;

import java.util.ArrayList;
import java.util.List;

/**
 * Educational Demonstration for CSC2104: Nested vs Inner Classes.
 *
 * Demonstrates:
 * 1. Static Nested Class (ParkingLot.ParkingStatistics):
 *    - Does NOT require an enclosing instance of ParkingLot to be instantiated.
 *    - Syntax: new ParkingLot.ParkingStatistics(...)
 *    - Cannot access non-static members of the outer class directly.
 * 2. Non-Static Inner Class (ParkingLot.SlotManager):
 *    - REQUIRES an enclosing instance of ParkingLot.
 *    - Syntax: parkingLotInstance.new SlotManager() or parkingLotInstance.getSlotManager()
 *    - Has direct implicit access to all private instance fields of the outer class (e.g. parkingGrid).
 */
public class NestedClassDemo {

    public static void main(String[] args) {
        System.out.println(executeAndCapture());
    }

    public static String executeAndCapture() {
        StringBuilder sb = new StringBuilder();
        sb.append("=================================================================\n");
        sb.append("         CSC2104 VIVA DEMO: STATIC NESTED VS NON-STATIC INNER    \n");
        sb.append("=================================================================\n\n");

        // PART 1: STATIC NESTED CLASS DEMONSTRATION
        sb.append("--- 1. STATIC NESTED CLASS: ParkingLot.ParkingStatistics ---\n");
        sb.append("Instantiation syntax: new ParkingLot.ParkingStatistics(20, 8)\n");
        sb.append("Notice: No outer ParkingLot instance was needed!\n");

        ParkingLot.ParkingStatistics stats = new ParkingLot.ParkingStatistics(20, 8);
        sb.append("Output -> ").append(stats.toString()).append("\n");
        sb.append("Total Capacity : ").append(stats.getTotalCapacity()).append("\n");
        sb.append("Occupied Slots : ").append(stats.getOccupiedCount()).append("\n");
        sb.append("Available Slots: ").append(stats.getAvailableCount()).append("\n");
        sb.append("Occupancy Rate : ").append(stats.getOccupancyRatePercentage()).append("%\n\n");

        // PART 2: NON-STATIC INNER CLASS DEMONSTRATION
        sb.append("--- 2. NON-STATIC INNER CLASS: ParkingLot.SlotManager ---\n");
        sb.append("Creating outer instance: ParkingLot outerLot = new ParkingLot(\"Viva Facility\", 2, 4);\n");
        ParkingLot outerLot = new ParkingLot("Viva Facility", 2, 4);

        List<ParkingSlot> demoSlots = new ArrayList<>();
        demoSlots.add(new ParkingSlot("B-01", SlotType.BIKE, 1, SlotStatus.OCCUPIED));
        demoSlots.add(new ParkingSlot("B-02", SlotType.BIKE, 1, SlotStatus.AVAILABLE));
        demoSlots.add(new ParkingSlot("C-01", SlotType.CAR, 1, SlotStatus.OCCUPIED));
        demoSlots.add(new ParkingSlot("C-02", SlotType.CAR, 1, SlotStatus.AVAILABLE));
        demoSlots.add(new ParkingSlot("B-03", SlotType.BIKE, 2, SlotStatus.AVAILABLE));
        demoSlots.add(new ParkingSlot("B-04", SlotType.BIKE, 2, SlotStatus.AVAILABLE));
        demoSlots.add(new ParkingSlot("C-03", SlotType.CAR, 2, SlotStatus.OCCUPIED));
        demoSlots.add(new ParkingSlot("T-01", SlotType.TRUCK, 2, SlotStatus.AVAILABLE));
        outerLot.populateGrid(demoSlots);

        sb.append("Instantiation syntax: outerLot.getSlotManager() [or outerLot.new SlotManager()]\n");
        ParkingLot.SlotManager innerManager = outerLot.getSlotManager();

        int freeSlotsCount = innerManager.countAvailableSlots();
        ParkingLot.ParkingStatistics liveStats = innerManager.computeCurrentStatistics();

        sb.append("Inner class accessing outer ParkingLot.parkingGrid directly:\n");
        sb.append("Available slots computed by Inner Class: ").append(freeSlotsCount).append("\n");
        sb.append("Live Statistics computed: ").append(liveStats.toString()).append("\n\n");

        sb.append("KEY TAKEAWAYS FOR VIVA:\n");
        sb.append("- Static nested class: Logical grouping, acts like a regular top-level class, zero memory overhead per outer instance.\n");
        sb.append("- Inner class: Tightly bound helper, holds hidden reference to outer instance ('ParkingLot.this'), can manipulate outer private state directly.\n");
        sb.append("=================================================================\n");
        return sb.toString();
    }
}
