package com.parking.management.threads;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Background monitoring thread extending java.lang.Thread.
 *
 * Demonstrates the following CSC2104 OOP Syllabus Concepts:
 * 1. Multithreading by extending java.lang.Thread (Approach 1)
 * 2. Thread Lifecycle (NEW -> RUNNABLE -> TIMED_WAITING -> TERMINATED)
 * 3. start() vs run() (Calling start() creates a real OS thread executing run())
 * 4. Thread Priority (setPriority(Thread.NORM_PRIORITY - 1))
 * 5. Safe Thread Control (volatile boolean flag, interrupt(), NO deprecated stop()/suspend()/resume())
 * 6. Inter-thread coordination
 */
public class ParkingMonitor extends Thread {

    private static final Logger logger = LoggerFactory.getLogger(ParkingMonitor.class);

    // Safe thread control flag using volatile for memory visibility across CPU cores
    private volatile boolean running = true;
    private volatile boolean paused = false;
    private final Object pauseLock = new Object();

    private final long intervalMillis;
    private int cycleCount = 0;

    public ParkingMonitor(String threadName, long intervalMillis) {
        super(threadName);
        this.intervalMillis = intervalMillis;
        // Setting thread priority demonstrating thread priority concept
        this.setPriority(Thread.NORM_PRIORITY - 1);
        this.setDaemon(true); // Allows JVM to shut down cleanly if needed
    }

    @Override
    public void run() {
        logger.info("[Thread: {}] ParkingMonitor thread started with priority {}.", getName(), getPriority());

        while (running) {
            try {
                // Safe pause mechanism using synchronization and wait()
                synchronized (pauseLock) {
                    while (paused && running) {
                        logger.info("[Thread: {}] Paused. Waiting for resume signal...", getName());
                        pauseLock.wait();
                    }
                }

                if (!running) {
                    break;
                }

                // Perform background monitoring activity
                cycleCount++;
                logger.debug("[Thread: {}] Heartbeat check #{}. System state normal.", getName(), cycleCount);

                // Thread sleep for interval
                Thread.sleep(intervalMillis);

            } catch (InterruptedException e) {
                logger.info("[Thread: {}] Interrupted received. Terminating safely.", getName());
                // Restore interrupted flag
                Thread.currentThread().interrupt();
                running = false;
            } catch (Exception e) {
                logger.error("[Thread: {}] Unexpected exception in monitor: {}", getName(), e.getMessage());
            }
        }

        logger.info("[Thread: {}] Monitor thread safely terminated after {} cycles.", getName(), cycleCount);
    }

    /**
     * Safe pause without deprecated Thread.suspend().
     */
    public void pauseMonitoring() {
        this.paused = true;
        logger.info("[Thread: {}] Pause requested.", getName());
    }

    /**
     * Safe resume without deprecated Thread.resume().
     */
    public void resumeMonitoring() {
        synchronized (pauseLock) {
            this.paused = false;
            pauseLock.notifyAll(); // Wake up paused thread safely
            logger.info("[Thread: {}] Resume signaled.", getName());
        }
    }

    /**
     * Safe stop without deprecated Thread.stop().
     */
    public void stopMonitoring() {
        this.running = false;
        this.paused = false;
        synchronized (pauseLock) {
            pauseLock.notifyAll();
        }
        this.interrupt(); // Break any active sleep or wait
        logger.info("[Thread: {}] Stop requested.", getName());
    }

    public boolean isRunningSafe() {
        return running;
    }

    public boolean isPausedSafe() {
        return paused;
    }

    public int getCycleCount() {
        return cycleCount;
    }
}
