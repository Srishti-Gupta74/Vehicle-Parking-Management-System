package com.parking.management.model;

import com.parking.management.exception.ParkingLotFullException;
import com.parking.management.exception.SlotUnavailableException;
import java.util.ArrayList;
import java.util.List;

/**
 * Domain class representing the physical Parking Facility.
 *
 * Demonstrates the following CSC2104 OOP Syllabus Concepts:
 * 1. Composition (ParkingLot HAS-A collection of ParkingSlots)
 * 2. 1D and Multidimensional Arrays (ParkingSlot[][] parkingGrid)
 * 3. Static Nested Class (ParkingLot.ParkingStatistics)
 * 4. Non-static Inner Class (ParkingLot.SlotManager)
 * 5. Recursion (findAvailableSlotRecursively)
 * 6. Method Overloading (multiple findSlot signatures)
 * 7. Synchronization (synchronized slot assignment preventing race conditions)
 * 8. Control flow (switch, nested if, for, while, do-while, break, continue)
 * 9. Objects as parameters & Returning objects
 */
// =========================================================================
// CSC2104 OOP CONCEPT: COMPOSITION, 2D ARRAYS, RECURSION & NESTED CLASSES
// - ParkingLot HAS-A 2D array grid: ParkingSlot[floor][slotIndex]
// - Demonstrates Static Nested Classes vs Non-Static Inner Classes
// - Synchronized thread safety during slot assignment
// =========================================================================
public class ParkingLot {

    private final String lotName;
    private final int totalFloors;
    private final int slotsPerFloor;

    // === CONCEPT: MULTIDIMENSIONAL ARRAY (2D array representing floors and bays) ===
    private ParkingSlot[][] parkingGrid;

    // Static constant
    public static final int DEFAULT_FLOORS = 2;
    public static final int DEFAULT_SLOTS_PER_FLOOR = 10;

    /**
     * Default constructor.
     */
    public ParkingLot() {
        this("VPMS Central Parking Facility", DEFAULT_FLOORS, DEFAULT_SLOTS_PER_FLOOR);
    }

    /**
     * Parameterized constructor initializing the parking grid.
     */
    public ParkingLot(String lotName, int totalFloors, int slotsPerFloor) {
        this.lotName = lotName;
        this.totalFloors = totalFloors;
        this.slotsPerFloor = slotsPerFloor;
        // Initializing 2D array:
        this.parkingGrid = new ParkingSlot[totalFloors][slotsPerFloor];
    }

    /**
     * Populates the 2D parking grid from a list of slots (e.g. from database).
     * Demonstrates nested loops, break, and array assignment.
     */
    public void populateGrid(List<ParkingSlot> slots) {
        if (slots == null) return;

        // Reset grid
        this.parkingGrid = new ParkingSlot[totalFloors][slotsPerFloor];

        int slotIdx = 0;
        int totalAvailableSlots = slots.size();

        // Nested for loop over 2D array
        for (int f = 0; f < totalFloors; f++) {
            for (int s = 0; s < slotsPerFloor; s++) {
                if (slotIdx >= totalAvailableSlots) {
                    break; // break statement demonstration
                }
                ParkingSlot current = slots.get(slotIdx);
                // Assign into multidimensional array
                parkingGrid[f][s] = current;
                slotIdx++;
            }
        }
    }

    // ==========================================
    // RECURSION IMPLEMENTATION (CSC2104 Syllabus)
    // ==========================================

    /**
     * Public facade for recursive slot search.
     * Demonstrates Recursion in a real parking grid traversal.
     */
    public ParkingSlot findAvailableSlotRecursively(SlotType slotType) {
        return searchGridRecursively(slotType, 0, 0);
    }

    /**
     * Recursive helper traversing the 2D array [floorIndex][slotIndex].
     * Base case 1: Out of bounds (no slot found) -> returns null.
     * Base case 2: Matching available slot found -> returns the ParkingSlot object.
     * Recursive step: Advance slotIndex or move to next floor.
     */
    private ParkingSlot searchGridRecursively(SlotType slotType, int floorIndex, int slotIndex) {
        // Base case: Traversed all floors without finding a match
        if (floorIndex >= totalFloors) {
            return null;
        }

        // Row boundary check: move to next floor
        if (slotIndex >= slotsPerFloor) {
            return searchGridRecursively(slotType, floorIndex + 1, 0);
        }

        ParkingSlot slot = parkingGrid[floorIndex][slotIndex];

        // Check if current slot satisfies conditions
        if (slot != null && slot.isAvailable() && slot.getSlotType() == slotType) {
            return slot; // Base case: Found!
        }

        // Recursive call: advance to next slot index on current floor
        return searchGridRecursively(slotType, floorIndex, slotIndex + 1);
    }

    // ==========================================
    // METHOD OVERLOADING (CSC2104 Syllabus)
    // ==========================================

    /**
     * Overloaded findSlot 1: By slot number (e.g. "C-01").
     * Demonstrates while loop and continue statement.
     */
    public ParkingSlot findSlot(String slotNumber) {
        if (slotNumber == null || slotNumber.trim().isEmpty()) {
            return null;
        }

        int f = 0;
        // While loop demonstration
        while (f < totalFloors) {
            int s = 0;
            // Nested while loop
            while (s < slotsPerFloor) {
                ParkingSlot slot = parkingGrid[f][s];
                s++;
                if (slot == null) {
                    continue; // continue statement demonstration
                }
                if (slot.getSlotNumber().equalsIgnoreCase(slotNumber.trim())) {
                    return slot;
                }
            }
            f++;
        }
        return null;
    }

    /**
     * Overloaded findSlot 2: By SlotType and specific floor.
     * Demonstrates nested if statements.
     */
    public ParkingSlot findSlot(SlotType type, int floor) {
        if (floor < 1 || floor > totalFloors) {
            return null;
        }
        int floorIdx = floor - 1;

        for (int s = 0; s < slotsPerFloor; s++) {
            ParkingSlot slot = parkingGrid[floorIdx][s];
            if (slot != null) {
                // Nested if demonstration
                if (slot.getSlotType() == type) {
                    if (slot.isAvailable()) {
                        return slot;
                    }
                }
            }
        }
        return null;
    }

    /**
     * Overloaded findSlot 3: By SlotType only (returns first available on any floor).
     */
    public ParkingSlot findSlot(SlotType type) {
        return findAvailableSlotRecursively(type);
    }

    // ==========================================
    // SYNCHRONIZATION (CSC2104 Syllabus)
    // ==========================================

    /**
     * Synchronized method assigning a slot to a vehicle.
     * Prevents race conditions when simultaneous parking requests arrive.
     *
     * @param vehicle the vehicle requesting parking
     * @return the assigned ParkingSlot
     * @throws ParkingLotFullException if no compatible slot is free
     */
    public synchronized ParkingSlot assignSlot(Vehicle vehicle) throws ParkingLotFullException {
        if (vehicle == null) {
            throw new IllegalArgumentException("Cannot assign slot to a null vehicle");
        }

        // Switch statement demonstrating control flow
        SlotType requiredType;
        switch (vehicle.getVehicleType().toUpperCase()) {
            case "BIKE":
                requiredType = SlotType.BIKE;
                break;
            case "CAR":
                requiredType = SlotType.CAR;
                break;
            case "TRUCK":
                requiredType = SlotType.TRUCK;
                break;
            default:
                throw new IllegalArgumentException("Unsupported vehicle type: " + vehicle.getVehicleType());
        }

        // Search using recursive method
        ParkingSlot assignedSlot = findAvailableSlotRecursively(requiredType);

        if (assignedSlot == null) {
            throw new ParkingLotFullException("No available slot for vehicle type: " + requiredType);
        }

        // Critical section: mark slot occupied atomically
        assignedSlot.occupy();
        return assignedSlot;
    }

    /**
     * Synchronized method to release a slot when a vehicle exits.
     */
    public synchronized void releaseSlot(ParkingSlot slot) throws SlotUnavailableException {
        if (slot == null) {
            throw new SlotUnavailableException("Specified slot cannot be null");
        }
        slot.vacate();
    }

    // ==========================================
    // NESTED AND INNER CLASSES (CSC2104 Syllabus)
    // ==========================================

    /**
     * 1. STATIC NESTED CLASS: ParkingStatistics
     * Independent analytical helper that can be instantiated without an outer ParkingLot object.
     */
    public static class ParkingStatistics {
        private final int totalCapacity;
        private final int occupiedCount;
        private final int availableCount;
        private final double occupancyRatePercentage;

        public ParkingStatistics(int totalCapacity, int occupiedCount) {
            this.totalCapacity = totalCapacity;
            this.occupiedCount = occupiedCount;
            this.availableCount = Math.max(0, totalCapacity - occupiedCount);
            // Implicit and explicit type casting:
            this.occupancyRatePercentage = (totalCapacity > 0)
                    ? ((double) occupiedCount / totalCapacity) * 100.0
                    : 0.0;
        }

        public int getTotalCapacity() {
            return totalCapacity;
        }

        public int getOccupiedCount() {
            return occupiedCount;
        }

        public int getAvailableCount() {
            return availableCount;
        }

        public double getOccupancyRatePercentage() {
            return Math.round(occupancyRatePercentage * 100.0) / 100.0;
        }

        @Override
        public String toString() {
            return String.format("Stats[Capacity=%d, Occupied=%d, Free=%d, Rate=%.2f%%]",
                    totalCapacity, occupiedCount, availableCount, occupancyRatePercentage);
        }
    }

    /**
     * 2. NON-STATIC INNER CLASS: SlotManager
     * Tightly coupled inner class having direct access to outer ParkingLot's private fields.
     */
    public class SlotManager {

        /**
         * Counts all available slots across the outer class's 2D grid.
         * Demonstrates do-while loop and access to outer parkingGrid.
         */
        public int countAvailableSlots() {
            int count = 0;
            int f = 0;
            // Outer while loop
            while (f < totalFloors) {
                int s = 0;
                // do-while loop demonstration
                do {
                    if (s < slotsPerFloor) {
                        ParkingSlot slot = parkingGrid[f][s];
                        if (slot != null && slot.isAvailable()) {
                            count++;
                        }
                    }
                    s++;
                } while (s < slotsPerFloor);
                f++;
            }
            return count;
        }

        /**
         * Creates a snapshot of ParkingStatistics using outer class data.
         */
        public ParkingStatistics computeCurrentStatistics() {
            int total = totalFloors * slotsPerFloor;
            int available = countAvailableSlots();
            int occupied = total - available;
            return new ParkingStatistics(total, occupied);
        }

        /**
         * Flattens the 2D grid into a 1D list of slots.
         */
        public List<ParkingSlot> getAllSlotsAsList() {
            List<ParkingSlot> list = new ArrayList<>();
            for (int f = 0; f < totalFloors; f++) {
                for (int s = 0; s < slotsPerFloor; s++) {
                    if (parkingGrid[f][s] != null) {
                        list.add(parkingGrid[f][s]);
                    }
                }
            }
            return list;
        }
    }

    // ==========================================
    // GETTERS
    // ==========================================

    public String getLotName() {
        return lotName;
    }

    public int getTotalFloors() {
        return totalFloors;
    }

    public int getSlotsPerFloor() {
        return slotsPerFloor;
    }

    public ParkingSlot[][] getParkingGrid() {
        return parkingGrid;
    }

    public SlotManager getSlotManager() {
        return new SlotManager();
    }
}
