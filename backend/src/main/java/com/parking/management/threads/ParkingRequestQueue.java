package com.parking.management.threads;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Thread-Safe Parking Request Queue demonstrating Inter-Thread Communication.
 *
 * Demonstrates the following CSC2104 OOP Syllabus Concepts:
 * 1. Synchronization (synchronized methods and monitor locks)
 * 2. Inter-Thread Communication:
 *    - wait() (waiting thread releases lock and suspends execution until signaled or timeout)
 *    - notify() / notifyAll() (awakens all waiting threads when a parking slot is freed)
 * 3. Race condition prevention on shared resources
 */
@Component
public class ParkingRequestQueue {

    private static final Logger logger = LoggerFactory.getLogger(ParkingRequestQueue.class);

    // List of vehicle numbers currently waiting in queue
    private final List<String> waitingQueue = new ArrayList<>();
    private int totalWakeupEvents = 0;

    /**
     * Called when a vehicle cannot find an immediate slot and wishes to wait for one to open.
     * Thread enters wait() state releasing the monitor lock.
     *
     * @param vehicleNumber registration number of the waiting vehicle
     * @param timeoutMillis maximum milliseconds to wait before giving up
     * @return true if notified by a freed slot event, false if timed out
     */
    public synchronized boolean waitForSlot(String vehicleNumber, long timeoutMillis) {
        String threadName = Thread.currentThread().getName();
        waitingQueue.add(vehicleNumber);
        logger.info("[Queue: {}] Vehicle {} enqueued. Current waiting queue size: {}. Thread entering wait().",
                threadName, vehicleNumber, waitingQueue.size());

        long startTime = System.currentTimeMillis();
        boolean slotBecameAvailable = false;

        try {
            // Guard against spurious wakeups using while loop check
            // Calling wait() releases the lock on this ParkingRequestQueue instance
            wait(timeoutMillis);

            long elapsed = System.currentTimeMillis() - startTime;
            if (elapsed < timeoutMillis) {
                logger.info("[Queue: {}] Vehicle {} awakened by notifyAll() signal after {}ms!",
                        threadName, vehicleNumber, elapsed);
                slotBecameAvailable = true;
            } else {
                logger.info("[Queue: {}] Vehicle {} wait timed out after {}ms.", threadName, vehicleNumber, elapsed);
            }

        } catch (InterruptedException e) {
            logger.warn("[Queue: {}] Waiting thread interrupted: {}", threadName, e.getMessage());
            Thread.currentThread().interrupt();
        } finally {
            waitingQueue.remove(vehicleNumber);
            logger.info("[Queue] Vehicle {} dequeued. Remaining in queue: {}", vehicleNumber, waitingQueue.size());
        }

        return slotBecameAvailable;
    }

    /**
     * Called when a vehicle checks out and a parking slot becomes available.
     * Calls notifyAll() to awaken all waiting threads!
     *
     * @param slotNumber the freed slot number (e.g. "C-01")
     * @param slotType the type of the freed slot (e.g. "CAR")
     */
    public synchronized void notifySlotFreed(String slotNumber, String slotType) {
        totalWakeupEvents++;
        logger.info("[Queue] Slot {} ({}) vacated! Broadcasting notifyAll() to {} waiting thread(s). Total events: {}",
                slotNumber, slotType, waitingQueue.size(), totalWakeupEvents);

        // Demonstrates notifyAll(): Awakens all threads that are waiting on this monitor
        notifyAll();
    }

    /**
     * Demonstrates notify() (wakes up a single waiting thread).
     */
    public synchronized void notifySingleWaiter() {
        if (!waitingQueue.isEmpty()) {
            logger.info("[Queue] Broadcasting notify() to a single waiting thread.");
            notify(); // Awakens one waiting thread
        }
    }

    public synchronized int getQueueSize() {
        return waitingQueue.size();
    }

    public synchronized List<String> getWaitingVehicles() {
        return new ArrayList<>(waitingQueue);
    }

    public synchronized int getTotalWakeupEvents() {
        return totalWakeupEvents;
    }
}
