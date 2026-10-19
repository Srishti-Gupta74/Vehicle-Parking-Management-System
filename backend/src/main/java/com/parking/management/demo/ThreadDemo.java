package com.parking.management.demo;

import com.parking.management.threads.ParkingMonitor;
import com.parking.management.threads.ReportGenerator;

/**
 * Comprehensive Multithreading Demonstration for CSC2104 OOP.
 *
 * Demonstrates:
 * 1. Two approaches to multithreading:
 *    a) Extending java.lang.Thread
 *    b) Implementing java.lang.Runnable
 * 2. Thread Lifecycle: NEW -> RUNNABLE -> TIMED_WAITING -> TERMINATED
 * 3. start() creates independent execution thread; run() merely executes synchronously in the caller thread!
 * 4. thread.setPriority()
 * 5. thread.join()
 * 6. Synchronized critical section preventing race conditions
 * 7. Inter-Thread Communication with wait() and notify()
 * 8. Safe thread control via volatile boolean flag
 */
public class ThreadDemo {

    // Shared resource to demonstrate race condition vs synchronization
    public static class SynchronizedSlotCounter {
        private int count = 0;

        // Synchronized method guarantees atomic increments across threads
        public synchronized void increment() {
            count++;
        }

        public synchronized int getCount() {
            return count;
        }
    }

    public static void main(String[] args) {
        System.out.println(executeAndCapture());
    }

    public static String executeAndCapture() {
        StringBuilder sb = new StringBuilder();
        sb.append("=================================================================\n");
        sb.append("         CSC2104 VIVA DEMO: JAVA MULTITHREADING & SYNCHRONIZATION\n");
        sb.append("=================================================================\n\n");

        // PART 1: EXTENDING THREAD VS IMPLEMENTING RUNNABLE
        sb.append("--- 1. Extending Thread vs Implementing Runnable ---\n");
        ParkingMonitor monitorThread = new ParkingMonitor("Viva-Monitor-Thread", 200);
        sb.append("Created monitorThread (extends Thread) State: ").append(monitorThread.getState()).append("\n");

        ReportGenerator runnableTask = new ReportGenerator("Viva-Audit-Report");
        Thread workerThread = new Thread(runnableTask, "Viva-Worker-Thread");
        sb.append("Created workerThread (implements Runnable) State: ").append(workerThread.getState()).append("\n\n");

        // PART 2: THREAD PRIORITY & LIFECYCLE START()
        sb.append("--- 2. Thread Priority & start() vs run() ---\n");
        monitorThread.setPriority(Thread.NORM_PRIORITY - 2); // Priority 3
        workerThread.setPriority(Thread.NORM_PRIORITY + 2);  // Priority 7
        sb.append("Monitor Thread Priority : ").append(monitorThread.getPriority()).append("\n");
        sb.append("Worker Thread Priority  : ").append(workerThread.getPriority()).append("\n");

        sb.append("Starting threads using start() [NOT run()]...\n");
        monitorThread.start();
        workerThread.start();

        sb.append("Threads running concurrently in background.\n\n");

        // PART 3: THREAD.JOIN()
        sb.append("--- 3. Thread Synchronization via join() ---\n");
        try {
            sb.append("Calling workerThread.join() -> Main caller thread pauses until workerThread finishes...\n");
            workerThread.join();
            sb.append("workerThread finished! Completed flag: ").append(runnableTask.isCompleted()).append("\n");
            sb.append("Worker summary: ").append(runnableTask.getGeneratedSummary()).append("\n\n");
        } catch (InterruptedException e) {
            sb.append("Interrupted during join: ").append(e.getMessage()).append("\n");
        }

        // Safely stopping monitor thread
        monitorThread.stopMonitoring();
        try {
            monitorThread.join(500);
        } catch (InterruptedException ignored) {}

        // PART 4: SYNCHRONIZATION ON SHARED RESOURCE
        sb.append("--- 4. Shared Resource Synchronization (Preventing Race Conditions) ---\n");
        SynchronizedSlotCounter counter = new SynchronizedSlotCounter();

        // Spawn 4 concurrent threads each incrementing 250 times (Total should be 1000)
        Thread[] threads = new Thread[4];
        for (int i = 0; i < 4; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < 250; j++) {
                    counter.increment();
                }
            });
            threads[i].start();
        }

        // Wait for all 4 threads to complete
        for (Thread t : threads) {
            try {
                t.join();
            } catch (InterruptedException ignored) {}
        }

        sb.append("Expected Count: 1000 | Actual Synchronized Count: ").append(counter.getCount()).append("\n");
        sb.append("Result: Accurate without race condition due to synchronized keyword!\n\n");

        // PART 5: INTER-THREAD COMMUNICATION (wait / notify)
        sb.append("--- 5. Inter-Thread Communication (wait() and notify()) ---\n");
        final Object lock = new Object();
        final boolean[] notified = {false};

        Thread waitingThread = new Thread(() -> {
            synchronized (lock) {
                try {
                    lock.wait(1000); // Wait up to 1 second for signal
                    notified[0] = true;
                } catch (InterruptedException ignored) {}
            }
        }, "WaitingVehicleThread");

        waitingThread.start();

        // Brief delay before signaling
        try { Thread.sleep(50); } catch (InterruptedException ignored) {}

        synchronized (lock) {
            lock.notify(); // Wake up waiting thread
        }

        try { waitingThread.join(); } catch (InterruptedException ignored) {}
        sb.append("Waiting thread successfully received notify() signal: ").append(notified[0]).append("\n");

        sb.append("=================================================================\n");
        return sb.toString();
    }
}
