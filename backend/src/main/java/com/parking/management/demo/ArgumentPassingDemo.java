package com.parking.management.demo;

/**
 * Educational Demonstration for CSC2104: Java Argument Passing.
 *
 * Demonstrates:
 * 1. Java is ALWAYS strictly Pass-by-Value.
 * 2. Primitives: A copy of the actual value is passed; changes inside the method DO NOT affect the caller.
 * 3. Object References: A COPY OF THE REFERENCE (address pointer) is passed by value.
 *    - Reassigning the reference to a new object inside the method DOES NOT affect the caller.
 *    - Mutating the internal state/properties of the object via the copied reference DOES affect the caller.
 *
 * This class is independently runnable via `main` for viva presentations.
 */
public class ArgumentPassingDemo {

    // Helper mutable class for demo
    public static class VehicleSlotHolder {
        private String slotNumber;

        public VehicleSlotHolder(String slotNumber) {
            this.slotNumber = slotNumber;
        }

        public String getSlotNumber() {
            return slotNumber;
        }

        public void setSlotNumber(String slotNumber) {
            this.slotNumber = slotNumber;
        }
    }

    public static void main(String[] args) {
        System.out.println(executeAndCapture());
    }

    public static String executeAndCapture() {
        StringBuilder out = new StringBuilder();
        out.append("=================================================================\n");
        out.append("         CSC2104 VIVA DEMO: JAVA ARGUMENT PASSING BEHAVIOR      \n");
        out.append("=================================================================\n\n");

        // PART 1: PRIMITIVE PASS-BY-VALUE
        out.append("--- PART 1: Primitives (Pass-by-Value) ---\n");
        int originalFee = 100;
        out.append("Before modifyPrimitive(int fee): fee = ").append(originalFee).append("\n");
        modifyPrimitive(originalFee);
        out.append("After modifyPrimitive(int fee) : fee = ").append(originalFee)
           .append(" -> Unchanged! (Value was copied)\n\n");

        // PART 2: OBJECT REFERENCE - REASSIGNMENT
        out.append("--- PART 2: Object Reference Reassignment (Pass-by-Value) ---\n");
        VehicleSlotHolder holder = new VehicleSlotHolder("C-01");
        out.append("Before reassignReference(holder): slotNumber = ").append(holder.getSlotNumber()).append("\n");
        reassignReference(holder);
        out.append("After reassignReference(holder) : slotNumber = ").append(holder.getSlotNumber())
           .append(" -> Unchanged! (The reference pointer was copied by value; reassignment was local)\n\n");

        // PART 3: OBJECT MUTATION THROUGH COPIED REFERENCE
        out.append("--- PART 3: Object State Mutation (Pass-by-Value) ---\n");
        out.append("Before mutateObjectState(holder): slotNumber = ").append(holder.getSlotNumber()).append("\n");
        mutateObjectState(holder);
        out.append("After mutateObjectState(holder) : slotNumber = ").append(holder.getSlotNumber())
           .append(" -> Changed to 'T-99'! (Both original and copied reference point to the same heap object)\n\n");

        out.append("CONCLUSION FOR VIVA: In Java, arguments are ALWAYS passed by value.\n");
        out.append("For primitives, the value is the data itself. For objects, the value is the memory reference.\n");
        out.append("=================================================================\n");
        return out.toString();
    }

    // Method attempting to modify primitive
    public static void modifyPrimitive(int fee) {
        fee = fee + 500; // Local copy modified
    }

    // Method attempting to reassign reference
    public static void reassignReference(VehicleSlotHolder ref) {
        ref = new VehicleSlotHolder("B-99"); // Local parameter reference reassigned
    }

    // Method mutating the referenced object
    public static void mutateObjectState(VehicleSlotHolder ref) {
        ref.setSlotNumber("T-99"); // Mutates the underlying object in heap
    }
}
