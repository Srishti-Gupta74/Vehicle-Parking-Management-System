package com.parking.management.demo;

/**
 * Educational Demonstration for CSC2104: Java Garbage Collection.
 *
 * Demonstrates:
 * 1. Object Lifecycle: Creation (Heap allocation) -> In-Use (Referenced) -> Unreferenced (Eligible for GC) -> Reclaimed.
 * 2. Scenarios causing objects to become eligible for Garbage Collection:
 *    - Nullifying references (obj = null)
 *    - Reassigning references to new objects
 *    - Objects created inside local method scope going out of scope
 *    - Island of isolation (circular references with no root path)
 * 3. System.gc() as an explicit REQUEST to JVM, NOT an absolute guarantee.
 * 4. Cleaner / PhantomReference / Free Memory tracking instead of deprecated finalize().
 */
public class GarbageCollectionDemo {

    public static class TemporaryVehicleSession {
        private final String sessionId;
        private final byte[] memoryPayload; // 2MB payload to demonstrate memory impact

        public TemporaryVehicleSession(String sessionId) {
            this.sessionId = sessionId;
            this.memoryPayload = new byte[2 * 1024 * 1024]; // 2MB
        }

        public String getSessionId() {
            return sessionId;
        }
    }

    public static void main(String[] args) {
        System.out.println(executeAndCapture());
    }

    public static String executeAndCapture() {
        StringBuilder sb = new StringBuilder();
        sb.append("=================================================================\n");
        sb.append("         CSC2104 VIVA DEMO: JAVA GARBAGE COLLECTION (GC)        \n");
        sb.append("=================================================================\n\n");

        Runtime runtime = Runtime.getRuntime();

        long initialFreeMemory = runtime.freeMemory();
        long totalMemory = runtime.totalMemory();
        sb.append(String.format("Initial Heap Stats: Free Memory = %.2f MB | Total = %.2f MB\n\n",
                bytesToMB(initialFreeMemory), bytesToMB(totalMemory)));

        // STEP 1: Object Creation in Heap
        sb.append("Step 1: Allocating 5 temporary 2MB session objects on the Heap...\n");
        TemporaryVehicleSession[] activeSessions = new TemporaryVehicleSession[5];
        for (int i = 0; i < 5; i++) {
            activeSessions[i] = new TemporaryVehicleSession("SESS-TEMP-" + (i + 1));
        }

        long afterAllocationFree = runtime.freeMemory();
        sb.append(String.format("After Allocation: Free Memory = %.2f MB (Decreased by %.2f MB)\n\n",
                bytesToMB(afterAllocationFree), bytesToMB(initialFreeMemory - afterAllocationFree)));

        // STEP 2: Making Objects Eligible for GC
        sb.append("Step 2: Nullifying references to make objects eligible for GC...\n");
        for (int i = 0; i < activeSessions.length; i++) {
            activeSessions[i] = null; // Unlink from root reference
        }
        sb.append("References nullified. Objects are now unreferenced and eligible for GC collection.\n\n");

        // STEP 3: Requesting Garbage Collection
        sb.append("Step 3: Invoking System.gc() / Runtime.getRuntime().gc()...\n");
        sb.append("NOTE FOR VIVA: System.gc() sends a hint/request to the JVM Garbage Collector.\n");
        sb.append("It is NEVER guaranteed to run immediately, but JVM normally prioritizes reclamation.\n");

        System.gc(); // Request GC

        try {
            // Brief pause to allow GC thread to sweep
            Thread.sleep(150);
        } catch (InterruptedException ignored) {}

        long afterGcFree = runtime.freeMemory();
        sb.append(String.format("After GC Execution: Free Memory = %.2f MB (Reclaimed ~%.2f MB)\n\n",
                bytesToMB(afterGcFree), bytesToMB(afterGcFree - afterAllocationFree)));

        sb.append("CRITICAL ACADEMIC POINT: Java 9+ deprecated finalize() due to thread blocking,\n");
        sb.append("zombie object revival, and performance hazards. Modern Java uses java.lang.ref.Cleaner\n");
        sb.append("and deterministic try-with-resources (AutoCloseable) for resource release.\n");
        sb.append("=================================================================\n");
        return sb.toString();
    }

    private static double bytesToMB(long bytes) {
        return (double) bytes / (1024.0 * 1024.0);
    }
}
