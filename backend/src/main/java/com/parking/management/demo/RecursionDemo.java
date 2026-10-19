package com.parking.management.demo;

/**
 * Educational Demonstration for CSC2104: Recursion.
 *
 * Demonstrates:
 * 1. Recursive algorithm searching for a free parking slot in a multi-floor grid.
 * 2. Base case identification (Out-of-bounds / Found).
 * 3. Call-stack unwinding and return value propagation.
 *
 * This class is independently runnable via `main`.
 */
public class RecursionDemo {

    public static void main(String[] args) {
        System.out.println(executeAndCapture());
    }

    public static String executeAndCapture() {
        StringBuilder sb = new StringBuilder();
        sb.append("=================================================================\n");
        sb.append("         CSC2104 VIVA DEMO: RECURSIVE PARKING SLOT SEARCH        \n");
        sb.append("=================================================================\n\n");

        // Simulated parking layout: 3 floors, 4 slots per floor
        // 0 = Occupied, 1 = Free
        int[][] layout = {
                {0, 0, 0, 0}, // Floor 1: All occupied
                {0, 0, 1, 0}, // Floor 2: Slot index 2 is free!
                {1, 1, 1, 1}  // Floor 3: Free
        };

        sb.append("Layout Matrix (0 = Occupied, 1 = Free):\n");
        for (int r = 0; r < layout.length; r++) {
            sb.append("  Floor ").append(r + 1).append(": [ ");
            for (int c = 0; c < layout[r].length; c++) {
                sb.append(layout[r][c]).append(" ");
            }
            sb.append("]\n");
        }
        sb.append("\nStarting recursive traversal from Floor 1, Slot 1...\n");

        String result = searchSlot(layout, 0, 0, sb, 1);
        sb.append("\nSearch Result: ").append(result).append("\n");
        sb.append("=================================================================\n");
        return sb.toString();
    }

    /**
     * Recursive search traversing row-by-row, column-by-column.
     *
     * @param grid 2D matrix
     * @param floor row index
     * @param slot col index
     * @param log logger builder
     * @param callDepth call stack trace depth
     * @return description of found slot or not found
     */
    private static String searchSlot(int[][] grid, int floor, int slot, StringBuilder log, int callDepth) {
        String indent = "  ".repeat(callDepth);

        // BASE CASE 1: Reached past the last floor without finding
        if (floor >= grid.length) {
            log.append(indent).append("-> Base Case: Out of floors! Entire lot full.\n");
            return "NO_SLOT_AVAILABLE";
        }

        // Row transition: if slot exceeds floor width, recurse to next floor, slot 0
        if (slot >= grid[floor].length) {
            log.append(indent).append("-> End of Floor ").append(floor + 1).append(". Moving to Floor ").append(floor + 2).append("...\n");
            return searchSlot(grid, floor + 1, 0, log, callDepth + 1);
        }

        log.append(indent).append("-> Checking Floor ").append(floor + 1)
           .append(", Slot ").append(slot + 1)
           .append(" (Status: ").append(grid[floor][slot] == 1 ? "FREE" : "OCCUPIED").append(")...\n");

        // BASE CASE 2: Free slot found!
        if (grid[floor][slot] == 1) {
            log.append(indent).append("-> SUCCESS! Base Case met at Floor ")
               .append(floor + 1).append(", Slot ").append(slot + 1).append("!\n");
            return "Found at Floor " + (floor + 1) + ", Slot " + (slot + 1);
        }

        // RECURSIVE STEP: Check next slot on the same floor
        return searchSlot(grid, floor, slot + 1, log, callDepth + 1);
    }
}
